import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const db = await open({
  filename: './database.db',
  driver: sqlite3.Database,
});

console.log('Database opened');

await db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS scholarships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  summary TEXT,
  deadline TEXT,
  content TEXT,
  form TEXT,
  image TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  scholarship_id INTEGER,
  title TEXT,
  content TEXT,
  order_index INTEGER,
  type TEXT DEFAULT 'text',
  FOREIGN KEY (scholarship_id) REFERENCES scholarships(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  scholarship_id INTEGER,
  data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

console.log('Tables created');

await db.exec(`ALTER TABLE scholarships ADD COLUMN image TEXT`).catch(() => {}); // Ignore if column exists

// Insert sample data
// await db.run(`INSERT INTO scholarships (title, summary, deadline) VALUES (?, ?, ?)`, ['Học bổng A', 'Mô tả A', '2026-12-31']);
// const id1 = (await db.get('SELECT last_insert_rowid() as id')).id;
// await db.run(`INSERT INTO sections (scholarship_id, content, order_index, type) VALUES (?, ?, ?, ?)`, [id1, 'Nội dung section 1 cho học bổng A', 0, 'text']);
// await db.run(`INSERT INTO scholarships (title, summary, deadline) VALUES (?, ?, ?)`, ['Học bổng B', 'Mô tả B', '2026-11-30']);
// const id2 = (await db.get('SELECT last_insert_rowid() as id')).id;
// await db.run(`INSERT INTO sections (scholarship_id, content, order_index, type) VALUES (?, ?, ?, ?)`, [id2, 'Nội dung section B', 0, 'text']);
// console.log('Sample data inserted');

export default db;
