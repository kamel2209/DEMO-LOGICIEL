const express = require('express');
const path = require('path');
const db = require('./db');
const { sendSMS, sendEmail } = require('./notify');
const { generateDraft } = require('./ai-reply');

const app = express();
app.use(express.json());

const DEMO_CLIENT_ID = 'demo-proplomb';

db.ensureDemoClient();

// ---------- Pages ----------
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'trigger.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'dashboard.html')));

// ---------- API : déclenchement d'une demande d'avis (artisan sur le terrain) ----------
app.post('/api/request-review', async (req, res) => {
  try {
    const { customerFirstName, phone, email } = req.body;

    if (!customerFirstName || (!phone && !email)) {
      return res.status(400).json({ error: 'Prénom du client + au moins un contact (téléphone ou email) requis.' });
    }

    const client = db.getClient(DEMO_CLIENT_ID);
    if (!client) return res.status(500).json({ error: 'Client de démo introuvable.' });

    const results = [];
    if (phone) {
      const r = await sendSMS({ to: phone, businessName: client.business_name, customerFirstName, reviewLink: client.google_review_link });
      results.push(r);
    }
    if (email) {
      const r = await sendEmail({ to: email, businessName: client.business_name, customerFirstName, reviewLink: client.google_review_link });
      results.push(r);
    }

    const channel = [phone && 'sms', email && 'email'].filter(Boolean).join('+');
    const entry = db.addReviewRequest({ clientId: DEMO_CLIENT_ID, customerFirstName, phone, email, channel });

    res.json({ ok: true, id: entry.id, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur, réessayez.' });
  }
});

// ---------- API : simuler la réception d'un nouvel avis Google (démo / tests) ----------
app.post('/api/simulate-review', (req, res) => {
  const { authorName, rating, reviewText } = req.body;
  if (!authorName || !rating || !reviewText) {
    return res.status(400).json({ error: 'authorName, rating, reviewText requis.' });
  }
  const entry = db.addReview({ clientId: DEMO_CLIENT_ID, authorName, rating, reviewText });
  res.json({ ok: true, id: entry.id });
});

// ---------- API : générer une proposition de réponse IA pour un avis ----------
app.post('/api/reviews/:id/generate-ai', (req, res) => {
  const review = db.getReview(req.params.id);
  if (!review) return res.status(404).json({ error: 'Avis introuvable.' });

  const client = db.getClient(review.client_id);
  const draft = generateDraft({
    businessName: client.business_name,
    authorName: review.author_name,
    rating: review.rating,
    reviewText: review.review_text,
    tone: client.tone,
    signature: client.signature,
  });

  db.setAiDraft(review.id, draft);
  res.json({ ok: true, draft });
});

// ---------- API : valider et "publier" une réponse (toujours une action humaine) ----------
app.post('/api/reviews/:id/validate', (req, res) => {
  const { finalText } = req.body;
  if (!finalText || !finalText.trim()) {
    return res.status(400).json({ error: 'Le texte de la réponse ne peut pas être vide.' });
  }
  const review = db.getReview(req.params.id);
  if (!review) return res.status(404).json({ error: 'Avis introuvable.' });

  db.validateReview(req.params.id, finalText);
  res.json({ ok: true });
});

// ---------- API : données du tableau de bord ----------
app.get('/api/dashboard-data', (req, res) => {
  const client = db.getClient(DEMO_CLIENT_ID);
  const requests = db.listReviewRequests(DEMO_CLIENT_ID);
  const reviews = db.listReviews(DEMO_CLIENT_ID);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  res.json({
    client,
    stats: {
      requestsSent: requests.length,
      totalReviews: reviews.length,
      avgRating,
      pendingResponse: reviews.filter(r => r.status === 'needs_response').length,
      published: reviews.filter(r => r.status === 'published').length,
    },
    requests,
    reviews,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ProPlomb Marseille — démo en écoute sur le port ${PORT}`));
