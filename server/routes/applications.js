import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.post('/api/apply', async (req, res) => {
  try {
    const { scholarship_id, ...data } = req.body;
    await pool.run(
      `INSERT INTO applications(scholarship_id, data)
       VALUES(?,?)`,
      [scholarship_id, JSON.stringify(data)]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/api/scholarships/:id/applications', async (req, res) => {
  try {
    const rows = await pool.all(
      'SELECT data, created_at FROM applications WHERE scholarship_id = ? ORDER BY created_at DESC',
      [req.params.id]
    );
    const parsed = rows.map(r => ({ data: JSON.parse(r.data || '{}'), created_at: r.created_at }));
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
