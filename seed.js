const db = require('./db');

const client = db.prepare('SELECT * FROM clients WHERE id = ?').get('demo-proplomb');

if (!client) {
  db.prepare(`
    INSERT INTO clients (id, business_name, contact_name, google_review_link, tone, signature)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    'demo-proplomb',
    'ProPlomb Marseille',
    'Karim (gérant)',
    'https://g.page/r/EXEMPLE-FICTIF-A-REMPLACER/review',
    'chaleureux, direct, sans jargon',
    "L'équipe ProPlomb Marseille"
  );
  console.log('✅ Client de démo "ProPlomb Marseille" créé.');
} else {
  console.log('ℹ️  Client de démo déjà présent, rien à faire.');
}
