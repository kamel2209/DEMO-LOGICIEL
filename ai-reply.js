/**
 * MOCK de génération de réponse IA.
 * En production, ce fichier appellera l'API Anthropic (Claude) avec un prompt du type :
 *
 *   "Tu réponds aux avis Google de {businessName}, une entreprise de {activité}.
 *    Ton souhaité : {tone}. Voici l'avis client (note {rating}/5) : "{reviewText}".
 *    Rédige une réponse courte, sincère, sans jamais inventer de faits, sans promettre
 *    ce qui n'a pas été fait, et adaptée à la note (prudence sur les avis <= 3 étoiles)."
 *
 * Pour la démo (sans clé API), on simule ce comportement avec des règles simples,
 * afin de pouvoir tester tout le parcours de validation humaine dès maintenant.
 */

function generateDraft({ businessName, authorName, rating, reviewText, tone, signature }) {
  const firstName = authorName.split(' ')[0];

  if (rating >= 4) {
    return `Bonjour ${firstName}, merci beaucoup pour votre avis, ça nous fait très plaisir ! ` +
      `C'est exactement ce qu'on cherche à offrir à chaque client. Au plaisir de vous revoir chez ${businessName}.` +
      (signature ? `\n${signature}` : '');
  }

  if (rating === 3) {
    return `Bonjour ${firstName}, merci d'avoir pris le temps de laisser votre avis. ` +
      `Nous prenons note de votre retour et restons à votre écoute si vous souhaitez nous en dire plus ` +
      `pour mieux faire la prochaine fois. N'hésitez pas à nous contacter directement.` +
      (signature ? `\n${signature}` : '');
  }

  // rating <= 2 : avis sensible — réponse volontairement prudente, factuelle, sans admission
  // ni invention. À relire attentivement avant validation (le dashboard le signale).
  return `Bonjour ${firstName}, merci de nous avoir fait part de votre expérience. ` +
    `Nous sommes désolés qu'elle n'ait pas été à la hauteur de vos attentes. ` +
    `Nous aimerions en comprendre les raisons plus précisément : pourriez-vous nous contacter directement ` +
    `au [numéro de ${businessName}] afin que nous puissions y remédier ?` +
    (signature ? `\n${signature}` : '');
}

module.exports = { generateDraft };
