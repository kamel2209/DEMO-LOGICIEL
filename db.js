const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');

const DATA_FILE = path.join(__dirname, 'data.json');

function load() {
  if (!fs.existsSync(DATA_FILE)) {
    return { clients: {}, reviewRequests: [], reviews: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch (e) {
    console.error('Impossible de lire data.json, on repart de zéro.', e);
    return { clients: {}, reviewRequests: [], reviews: [] };
  }
}

function save(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

let data = load();

function ensureDemoClient() {
  if (!data.clients['demo-proplomb']) {
    data.clients['demo-proplomb'] = {
      id: 'demo-proplomb',
      business_name: 'ProPlomb Marseille',
      contact_name: 'Karim (gérant)',
      google_review_link: 'https://g.page/r/EXEMPLE-FICTIF-A-REMPLACER/review',
      tone: 'chaleureux, direct, sans jargon',
      signature: "L'équipe ProPlomb Marseille",
      created_at: new Date().toISOString(),
    };
    save(data);
    console.log('✅ Client de démo "ProPlomb Marseille" créé automatiquement.');
  }
}

function getClient(id) {
  return data.clients[id] || null;
}

function addReviewRequest({ clientId, customerFirstName, phone, email, channel }) {
  const entry = {
    id: nanoid(),
    client_id: clientId,
    customer_first_name: customerFirstName,
    phone: phone || null,
    email: email || null,
    channel,
    status: 'sent',
    sent_at: new Date().toISOString(),
  };
  data.reviewRequests.unshift(entry);
  save(data);
  return entry;
}

function listReviewRequests(clientId) {
  return data.reviewRequests.filter(r => r.client_id === clientId);
}

function addReview({ clientId, authorName, rating, reviewText }) {
  const entry = {
    id: nanoid(),
    client_id: clientId,
    author_name: authorName,
    rating,
    review_text: reviewText,
    received_at: new Date().toISOString(),
    status: 'needs_response',
    ai_draft: null,
    final_response: null,
    published_at: null,
  };
  data.reviews.unshift(entry);
  save(data);
  return entry;
}

function getReview(id) {
  return data.reviews.find(r => r.id === id) || null;
}

function listReviews(clientId) {
  return data.reviews.filter(r => r.client_id === clientId);
}

function setAiDraft(id, draft) {
  const review = getReview(id);
  if (!review) return null;
  review.ai_draft = draft;
  save(data);
  return review;
}

function validateReview(id, finalText) {
  const review = getReview(id);
  if (!review) return null;
  review.final_response = finalText;
  review.status = 'published';
  review.published_at = new Date().toISOString();
  save(data);
  return review;
}

module.exports = {
  ensureDemoClient,
  getClient,
  addReviewRequest,
  listReviewRequests,
  addReview,
  getReview,
  listReviews,
  setAiDraft,
  validateReview,
};
