import express from 'express';
import multer from 'multer';
import pool from '../db.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/api/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  try {
    const result = await pool.run(
      'INSERT INTO temp_images (data, filename, mimetype) VALUES (?, ?, ?)',
      [req.file.buffer, req.file.originalname, req.file.mimetype]
    );
    const imageId = result.lastID;
    res.json({ id: imageId });
  } catch (err) {
    console.error('Error saving image to DB:', err);
    res.status(500).json({ error: 'Failed to save image' });
  }
});

// Get temp image
router.get('/api/temp-images/:id', async (req, res) => {
  try {
    const img = await pool.get('SELECT data, mimetype FROM temp_images WHERE id = ?', [req.params.id]);
    if (!img) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.set('Content-Type', img.mimetype || 'image/jpeg');
    res.send(img.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
