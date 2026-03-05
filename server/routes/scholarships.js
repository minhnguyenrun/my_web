x
router.post('/api/admin/scholarships', async (req, res) => {
  try {
    const { title, summary, sections, deadline, image } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    const parsedDeadline = deadline ? new Date(deadline).toISOString().split('T')[0] : null;
    
    let imageData = null;
    let imageMimetype = null;
    if (image && typeof image === 'number') {
      const tempImage = await pool.get('SELECT data, mimetype FROM temp_images WHERE id = ?', [image]);
      if (tempImage) {
        imageData = tempImage.data;
        imageMimetype = tempImage.mimetype || null;
        await pool.run('DELETE FROM temp_images WHERE id = ?', [image]);
      }
    }
    
    const r = await pool.run(
      `INSERT INTO scholarships(title,summary,deadline,image,image_mimetype) VALUES(?,?,?,?,?)`,
      [title, summary, parsedDeadline, imageData, imageMimetype]
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

    res.json({ id: scholarshipId, title, summary, deadline: parsedDeadline, image: imageData ? scholarshipId : null });
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

    let shouldUpdateImage = false;
    let imageData = null;
    let imageMimetype = null;

    if (image && typeof image === 'number') {
      const tempImage = await pool.get('SELECT data, mimetype FROM temp_images WHERE id = ?', [image]);
      if (tempImage) {
        shouldUpdateImage = true;
        imageData = tempImage.data;
        imageMimetype = tempImage.mimetype || null;
        await pool.run('DELETE FROM temp_images WHERE id = ?', [image]);
      }
    } else if (image === null) {
      shouldUpdateImage = true;
      imageData = null;
      imageMimetype = null;
    }

    if (shouldUpdateImage) {
      await pool.run(
        'UPDATE scholarships SET title = ?, summary = ?, deadline = ?, image = ?, image_mimetype = ? WHERE id = ?',
        [title, summary, parsedDeadline, imageData, imageMimetype, req.params.id]
      );
    } else {
      await pool.run(
        'UPDATE scholarships SET title = ?, summary = ?, deadline = ? WHERE id = ?',
        [title, summary, parsedDeadline, req.params.id]
      );
    }

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
