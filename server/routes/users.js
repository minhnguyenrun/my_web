import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/api/users', async (req, res) => {
  try {
    const result = await pool.all('SELECT * FROM users ORDER BY id');
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/api/users', async (req, res) => {
  try {
    const { name } = req.body;
    const result = await pool.run('INSERT INTO users(name) VALUES(?)', [name]);
    res.json({ id: result.lastID, name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
