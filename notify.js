/**
 * MOCK d'envoi SMS + Email.
 * En production, ce fichier appellera l'API Brevo (ou équivalent) avec une vraie clé API.
 * Pour l'instant : on "envoie" en construisant le message réel et on le journalise +
 * on le stocke, pour pouvoir le montrer dans une démo sans compte externe.
 */

function buildMessage({ businessName, customerFirstName, reviewLink }) {
  const sms = `Bonjour ${customerFirstName}, merci pour votre confiance ! ` +
    `${businessName} serait ravi d'avoir votre avis : ${reviewLink} (30 secondes, ça compte beaucoup pour nous 🙏)`;

  const emailSubject = `${businessName} — Merci pour votre confiance !`;
  const emailBody = `Bonjour ${customerFirstName},\n\n` +
    `Merci d'avoir fait confiance à ${businessName} pour votre intervention.\n` +
    `Si vous avez deux minutes, un avis Google nous aiderait énormément à continuer à bien servir nos clients :\n\n` +
    `${reviewLink}\n\n` +
    `Merci encore,\nL'équipe ${businessName}\n\n` +
    `--\nVous ne souhaitez plus recevoir ce type de message ? Répondez STOP.`;

  return { sms, emailSubject, emailBody };
}

async function sendSMS({ to, businessName, customerFirstName, reviewLink }) {
  const { sms } = buildMessage({ businessName, customerFirstName, reviewLink });
  // MOCK — en prod : appel API Brevo Transactional SMS
  console.log(`[MOCK SMS -> ${to}] ${sms}`);
  return { ok: true, channel: 'sms', preview: sms };
}

async function sendEmail({ to, businessName, customerFirstName, reviewLink }) {
  const { emailSubject, emailBody } = buildMessage({ businessName, customerFirstName, reviewLink });
  // MOCK — en prod : appel API Brevo Transactional Email
  console.log(`[MOCK EMAIL -> ${to}] Sujet: ${emailSubject}\n${emailBody}`);
  return { ok: true, channel: 'email', preview: `${emailSubject}\n\n${emailBody}` };
}

module.exports = { sendSMS, sendEmail, buildMessage };
