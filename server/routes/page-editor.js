import express from 'express';
import pool from '../db.js';

const router = express.Router();

async function attachPageSections(page) {
  try {
    const sections = await pool.all(
      'SELECT id, title, content, type FROM page_sections WHERE page_id = ? ORDER BY order_index',
      [page.id]
    );
    page.sections = sections.map(sec => {
      if (sec.type === 'image') {
        return { ...sec, content: sec.id }; // return id instead of blob
      }
      return sec;
    });
  } catch (err) {
    console.error('Error fetching sections for page', page.id, err);
    page.sections = [];
  }
}

async function moveTempImagesToPage(pageId, sections) {
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (section.type === 'image' && typeof section.content === 'number') {
      // content is temp_image id
      const tempImage = await pool.get('SELECT data, mimetype FROM temp_images WHERE id = ?', [section.content]);
      if (tempImage) {
        await pool.run(
          `UPDATE page_sections SET content = ?, mimetype = ? WHERE page_id = ? AND order_index = ?`,
          [tempImage.data, tempImage.mimetype, pageId, i]
        );
        await pool.run('DELETE FROM temp_images WHERE id = ?', [section.content]);
      }
    }
  }
}

// Get page content with sections
router.get('/api/pages/:id', async (req, res) => {
  try {
    const page = await pool.get('SELECT * FROM pages WHERE id = ?', [req.params.id]);
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    await attachPageSections(page);
    res.json(page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get page section image
router.get('/api/page-images/:sectionId', async (req, res) => {
  try {
    const section = await pool.get('SELECT content, type, mimetype FROM page_sections WHERE id = ?', [req.params.sectionId]);
    if (!section || section.type !== 'image') {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.set('Content-Type', section.mimetype || 'image/jpeg');
    res.send(section.content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update page content with sections
router.put('/api/pages/:id', async (req, res) => {
  try {
    const { title, sections } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    await pool.run(
      'UPDATE pages SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, req.params.id]
    );

    // Delete old sections
    await pool.run('DELETE FROM page_sections WHERE page_id = ?', [req.params.id]);

    // Insert new sections
    if (sections && Array.isArray(sections)) {
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        await pool.run(
          `INSERT INTO page_sections(page_id, title, content, order_index, type) VALUES(?,?,?,?,?)`,
          [req.params.id, section.title || null, section.content || '', i, section.type || 'text']
        );
      }
      await moveTempImagesToPage(req.params.id, sections);
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
