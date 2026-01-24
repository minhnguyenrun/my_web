import db from './db.js';

await db.run(
  "INSERT INTO scholarships(title, summary, content, form) VALUES(?, ?, ?, ?)",
  ['Hoc bong A', 'Tom tat', '[{"title":"Muc 1","text":"Noi dung"}]', '[{"question":"Ho ten","type":"text"}]']
);

console.log('Inserted');