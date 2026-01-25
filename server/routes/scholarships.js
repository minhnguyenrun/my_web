import express from 'express';
import pool from '../db.js';
import path from 'path';
import fs from 'fs';
import ExcelJS from 'exceljs';

const router = express.Router();

async function attachSections(list) {
  for (let s of list) {
    try {
      const sections = await pool.all(
        'SELECT title, content, type FROM sections WHERE scholarship_id = ? ORDER BY order_index',
        [s.id]
      );
      s.sections = sections;
    } catch (err) {
      console.error('Error fetching sections for', s.id, err);
      s.sections = [];
    }
  }
}

async function moveTempImages(scholarshipId, sections) {
  const scholarshipDir = path.join(process.cwd(), 'public/uploads', scholarshipId.toString());
  if (!fs.existsSync(scholarshipDir)) fs.mkdirSync(scholarshipDir, { recursive: true });
  let imageIndex = 1;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (section.type === 'image' && typeof section.content === 'string' && section.content.startsWith('/temp/')) {
      const tempPath = path.join(process.cwd(), 'public', section.content);
      const ext = path.extname(tempPath);
      const newFilename = `images${imageIndex}${ext}`;
      const newPath = path.join(scholarshipDir, newFilename);
      if (fs.existsSync(tempPath)) {
        fs.renameSync(tempPath, newPath);
      }
      const newUrl = `/uploads/${scholarshipId}/${newFilename}`;
      await pool.run(
        `UPDATE sections SET content = ? WHERE scholarship_id = ? AND order_index = ?`,
        [newUrl, scholarshipId, i]
      );
      imageIndex++;
    }
  }
}

router.get('/api/scholarships', async (req, res) => {
  try {
    const r = await pool.all(
      'SELECT id, title, summary, deadline, content, form, image FROM scholarships ORDER BY created_at DESC'
    );
    await attachSections(r);
    res.json(r);
  } catch (err) {
    console.error('Error in /api/scholarships', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/api/scholarships/:id', async (req, res) => {
  try {
    const s = await pool.get('SELECT * FROM scholarships WHERE id=?', [req.params.id]);
    if (!s) return res.status(404).json({ error: 'Not found' });
    const sections = await pool.all('SELECT title, content, type FROM sections WHERE scholarship_id = ? ORDER BY order_index', [req.params.id]);
    s.sections = sections;
    res.json(s);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/api/admin/scholarships', async (req, res) => {
  try {
    const { title, summary, sections, deadline, image } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    const parsedDeadline = deadline ? new Date(deadline).toISOString().split('T')[0] : null;
    const r = await pool.run(
      `INSERT INTO scholarships(title,summary,deadline,image) VALUES(?,?,?,?)`,
      [title, summary, parsedDeadline, image || null]
    );
    const scholarshipId = r.lastID;

    if (sections && Array.isArray(sections)) {
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        await pool.run(
          `INSERT INTO sections(scholarship_id, title, content, order_index, type) VALUES(?,?,?,?,?)`,
          [scholarshipId, section.title || null, section.content || '', i, section.type || 'text']
        );
      }
      await moveTempImages(scholarshipId, sections);
    }

    res.json({ id: scholarshipId, title, summary, deadline: parsedDeadline, image });
  } catch (err) {
    console.error('Insert error:', err.message, err.stack);
    res.status(500).json({ error: err.message });
  }
});

router.get('/api/scholarships/:id/export', async (req, res) => {
  try {
    const applications = await pool.all('SELECT data, created_at FROM applications WHERE scholarship_id = ?', [req.params.id]);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Applications');

    const keys = applications.length > 0 ? Object.keys(JSON.parse(applications[0].data)) : [];
    worksheet.addRow(['Submitted At', ...keys]);

    applications.forEach(app => {
      const data = JSON.parse(app.data);
      worksheet.addRow([app.created_at, ...keys.map(k => data[k] || '')]);
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=applications.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/api/admin/scholarships/:id/form', async (req, res) => {
  try {
    const { form } = req.body;
    await pool.run('UPDATE scholarships SET form = ? WHERE id = ?', [form, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/api/admin/scholarships/:id', async (req, res) => {
  try {
    const { title, summary, sections, deadline, image } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    const parsedDeadline = deadline ? new Date(deadline).toISOString().split('T')[0] : null;
    await pool.run('UPDATE scholarships SET title = ?, summary = ?, deadline = ?, image = ? WHERE id = ?', [title, summary, parsedDeadline, image || '', req.params.id]);

    await pool.run('DELETE FROM sections WHERE scholarship_id = ?', [req.params.id]);

    if (sections && Array.isArray(sections)) {
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        await pool.run(
          `INSERT INTO sections(scholarship_id, title, content, order_index, type) VALUES(?,?,?,?,?)`,
          [req.params.id, section.title || null, section.content || '', i, section.type || 'text']
        );
      }
      await moveTempImages(req.params.id, sections);
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/api/admin/scholarships/:id', async (req, res) => {
  try {
    await pool.run('DELETE FROM scholarships WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
