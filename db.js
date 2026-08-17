const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'data.sqlite'));
db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,
  business_name TEXT NOT NULL,
  contact_name TEXT,
  google_review_link TEXT NOT NULL,
  tone TEXT DEFAULT 'chaleureux et professionnel',
  signature TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS review_requests (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  customer_first_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  channel TEXT NOT NULL,
  status TEXT DEFAULT 'sent',
  sent_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (client_id) REFERENCES clients(id)
);

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  rating INTEGER NOT NULL,
  review_text TEXT NOT NULL,
  received_at TEXT DEFAULT (datetime('now')),
  status TEXT DEFAULT 'needs_response',
  ai_draft TEXT,
  final_response TEXT,
  published_at TEXT,
  FOREIGN KEY (client_id) REFERENCES clients(id)
);
`);

module.exports = db;
