import express from "express";
import cors from "cors";
import pool from "./db.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import ExcelJS from 'exceljs';
import multer from 'multer';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

/* Serve frontend */
app.use(express.static(path.join(__dirname, "../public")));

// Multer config for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'public/temp'));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Upload image
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const imageUrl = `/temp/${req.file.filename}`;
  res.json({ url: imageUrl });
});

/* ------------------ API USERS ------------------ */

app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.all("SELECT * FROM users ORDER BY id");
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const { name } = req.body;
    const result = await pool.run(
      "INSERT INTO users(name) VALUES(?)",
      [name]
    );
    res.json({ id: result.lastID, name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- SCHOLARSHIPS ---------------- */

app.get("/api/scholarships", async (req, res) => {
  try {
    const r = await pool.all(
      "SELECT id, title, summary, deadline, content, form FROM scholarships ORDER BY created_at DESC"
    );
    for (let s of r) {
      try {
        const sections = await pool.all(
          "SELECT title, content, type FROM sections WHERE scholarship_id = ? ORDER BY order_index",
          [s.id]
        );
        s.sections = sections;
      } catch (err) {
        console.error('Error fetching sections for', s.id, err);
        s.sections = [];
      }
    }
    res.json(r);
  } catch (err) {
    console.error('Error in /api/scholarships', err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/scholarships/:id", async (req, res) => {
  try {
    const s = await pool.get(
      "SELECT * FROM scholarships WHERE id=?",
      [req.params.id]
    );
    if (!s) return res.status(404).json({ error: 'Not found' });

    // Get sections
    const sections = await pool.all(
      "SELECT title, content, type FROM sections WHERE scholarship_id = ? ORDER BY order_index",
      [req.params.id]
    );

    s.sections = sections;
    res.json(s);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/admin/scholarships", async (req, res) => {
  try {
    const { title, summary, sections, deadline } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    const parsedDeadline = deadline ? new Date(deadline).toISOString().split('T')[0] : null;
    const r = await pool.run(
      `INSERT INTO scholarships(title,summary,deadline)
       VALUES(?,?,?)`,
      [title, summary, parsedDeadline]
    );
    const scholarshipId = r.lastID;

    // Insert sections
    if (sections && Array.isArray(sections)) {
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        await pool.run(
          `INSERT INTO sections(scholarship_id, title, content, order_index, type)
           VALUES(?,?,?,?,?)`,
          [scholarshipId, section.title || null, section.content || '', i, section.type || 'text']
        );
      }
    }

    // Move temp images to scholarship folder
    const scholarshipDir = path.join(process.cwd(), 'public/uploads', scholarshipId.toString());
    if (!fs.existsSync(scholarshipDir)) {
      fs.mkdirSync(scholarshipDir, { recursive: true });
    }
    let imageIndex = 1;
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      if (section.type === 'image') {
        if (section.content.startsWith('/temp/')) {
          const tempPath = path.join(process.cwd(), 'public', section.content);
          const ext = path.extname(tempPath);
          const newFilename = `images${imageIndex}${ext}`;
          const newPath = path.join(scholarshipDir, newFilename);
          if (fs.existsSync(tempPath)) {
            fs.renameSync(tempPath, newPath);
          }
          const newUrl = `/uploads/${scholarshipId}/${newFilename}`;
          // Update content in db
          await pool.run(
            `UPDATE sections SET content = ? WHERE scholarship_id = ? AND order_index = ?`,
            [newUrl, scholarshipId, i]
          );
        }
        imageIndex++;
      }
    }

    res.json({ id: scholarshipId, title, summary, deadline: parsedDeadline });
  } catch (err) {
    console.error('Insert error:', err.message, err.stack);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/scholarships/:id/export", async (req, res) => {
  try {
    const applications = await pool.all(
      "SELECT data, created_at FROM applications WHERE scholarship_id = ?",
      [req.params.id]
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Applications');

    // Get keys from first application
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

app.put("/api/admin/scholarships/:id/form", async (req, res) => {
  try {
    const { form } = req.body;
    await pool.run(
      `UPDATE scholarships SET form = ? WHERE id = ?`,
      [form, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/admin/scholarships/:id", async (req, res) => {
  try {
    const { title, summary, sections, deadline } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    const parsedDeadline = deadline ? new Date(deadline).toISOString().split('T')[0] : null;
    await pool.run(
      `UPDATE scholarships SET title = ?, summary = ?, deadline = ? WHERE id = ?`,
      [title, summary, parsedDeadline, req.params.id]
    );

    // Delete old sections
    await pool.run(`DELETE FROM sections WHERE scholarship_id = ?`, [req.params.id]);

    // Insert new sections
    if (sections && Array.isArray(sections)) {
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        await pool.run(
          `INSERT INTO sections(scholarship_id, title, content, order_index, type)
           VALUES(?,?,?,?,?)`,
          [req.params.id, section.title || null, section.content || '', i, section.type || 'text']
        );
      }
    }

    // Move temp images to scholarship folder
    const scholarshipDir = path.join(process.cwd(), 'public/uploads', req.params.id);
    if (!fs.existsSync(scholarshipDir)) {
      fs.mkdirSync(scholarshipDir, { recursive: true });
    }
    let imageIndex = 1;
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      if (section.type === 'image') {
        if (section.content.startsWith('/temp/')) {
          const tempPath = path.join(process.cwd(), 'public', section.content);
          const ext = path.extname(tempPath);
          const newFilename = `images${imageIndex}${ext}`;
          const newPath = path.join(scholarshipDir, newFilename);
          if (fs.existsSync(tempPath)) {
            fs.renameSync(tempPath, newPath);
          }
          const newUrl = `/uploads/${req.params.id}/${newFilename}`;
          // Update content in db
          await pool.run(
            `UPDATE sections SET content = ? WHERE scholarship_id = ? AND order_index = ?`,
            [newUrl, req.params.id, i]
          );
        }
        imageIndex++;
      }
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/admin/scholarships/:id", async (req, res) => {
  try {
    await pool.run(
      `DELETE FROM scholarships WHERE id = ?`,
      [req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- APPLICATION ---------------- */

app.post("/api/apply", async (req, res) => {
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

/* ---------------- DETAIL PAGES ---------------- */

app.get("/detail/:id", async (req, res) => {
  try {
    const s = await pool.get(
      "SELECT * FROM scholarships WHERE id=?",
      [req.params.id]
    );
    if (!s) {
      return res.status(404).send("Không tìm thấy học bổng");
    }

    // Get sections
    const sections = await pool.all(
      "SELECT * FROM sections WHERE scholarship_id=? ORDER BY order_index",
      [req.params.id]
    );
    s.sections = sections;

    // Render content as sections
    let contentHtml = '';
    if (s.sections && s.sections.length > 0) {
      s.sections.forEach(section => {
        if (section.type === 'image') {
          contentHtml += `<div class="section"><img src="${section.content}" alt="Scholarship image" style="max-width:100%;"></div>`;
        } else {
          contentHtml += `<div class="section"><div>${section.content || ''}</div></div>`;
        }
      });
    } else {
      contentHtml = '<div class="section"><p>Chưa có nội dung</p></div>';
    }

    // Render form fields
    let formHtml = '';
    try {
      const fields = JSON.parse(s.form || '[]');
      if (fields.length === 0) {
        formHtml = '<p>Chưa có form đăng ký</p>';
      } else {
        fields.forEach(field => {
          formHtml += `<div class="form-group">
            <label>${field.question}</label>
            <input type="${field.type || 'text'}" id="field-${field.question.replace(/\s+/g, '-').toLowerCase()}">
          </div>`;
        });
      }
    } catch (e) {
      formHtml = `<div class="form-group">
        <label>Họ tên</label>
        <input type="text" id="full_name">
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" id="email">
      </div>
      <div class="form-group">
        <label>Ghi chú</label>
        <textarea id="note"></textarea>
      </div>`;
    }

    const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chi Tiết Học Bổng</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #ffffff;
      color: #333;
      margin: 0;
      padding: 0;
      line-height: 1.6;
    }
    header {
      background-color: #f8f9fa;
      padding: 10px 20px;
      border-bottom: 1px solid #e9ecef;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    header h1 {
      margin: 0;
      color: #495057;
    }
    nav {
      display: flex;
      gap: 20px;
    }
    nav a {
      text-decoration: none;
      color: #007bff;
      font-weight: bold;
      padding: 10px;
      border-radius: 5px;
      transition: background-color 0.3s;
    }
    nav a:hover {
      background-color: #e9ecef;
    }
    .container {
      max-width: 1200px;
      margin: 20px auto;
      padding: 0 20px;
    }
    .section {
      background-color: #fff;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .section h2 {
      margin-top: 0;
      color: #495057;
      border-bottom: 2px solid #007bff;
      padding-bottom: 10px;
    }
    .form-group {
      margin-bottom: 15px;
    }
    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    .form-group input, .form-group textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 16px;
    }
    .btn {
      display: inline-block;
      padding: 10px 20px;
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      transition: background-color 0.3s;
    }
    .btn:hover {
      background-color: #218838;
    }
    .back-btn {
      background-color: #6c757d;
      margin-bottom: 20px;
    }
    .back-btn:hover {
      background-color: #5a6268;
    }
  </style>
</head>
<body>
  <header>
    <nav>
      <a href="/index.html">Trang Chủ</a>
      <a href="/admin.html">Quản Lý</a>
      <a href="/about.html">Về Chúng Tôi</a>
      <a href="/profiles.html">Hồ Sơ Học Bổng</a>
    </nav>
    <h1>${s.title || "Không có tiêu đề"}</h1>
  </header>
  <div class="container">
    <button class="btn back-btn" onclick="history.back()">Quay Lại</button>
    <div id="content">${contentHtml}</div>
    <div id="actions">
      <button id="fill-form-btn" class="btn" style="display: none;">Điền Form Đăng Ký</button>
      <button id="edit-form-btn" class="btn" style="display: none;">Tạo/Edit Form</button>
    </div>
    <div id="application-form" style="display: none;">
      <h2>Đăng Ký Học Bổng</h2>
      <div id="form-fields">${formHtml}</div>
      <button class="btn" onclick="apply(${s.id})">Gửi Đăng Ký</button>
    </div>
    <div id="admin-section" style="display: none;">
      <h2>Quản Lý Đơn Đăng Ký</h2>
      <button class="btn" onclick="exportExcel(${s.id})">Xuất Excel</button>
      <div id="applications-list"></div>
    </div>
  </div>

  <script>
    const scholarshipData = ${JSON.stringify(s)};

    // Show buttons based on user role (simplified)
    document.getElementById("fill-form-btn").style.display = "inline-block";
    document.getElementById("edit-form-btn").style.display = "inline-block";

    function apply(id) {
      const data = {};
      document.querySelectorAll('#form-fields input, #form-fields textarea').forEach(el => {
        data[el.id] = el.value;
      });
      fetch("/api/apply", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ scholarship_id: id, ...data })
      }).then(r => r.json()).then(() => {
        alert("Đã gửi đăng ký");
      }).catch(() => alert("Lỗi"));
    }

    function exportExcel(id) {
      window.open(\`/api/scholarships/\${id}/export\`, '_blank');
    }

    // Load applications if admin
    fetch(\`/api/scholarships/\${${s.id}}/applications\`)
      .then(r => r.json())
      .then(data => {
        document.getElementById("applications-list").innerHTML = data.map(app =>
          \`<div>\${app.created_at}: \${JSON.stringify(app.data)}</div>\`
        ).join("");
        document.getElementById("admin-section").style.display = "block";
      });
  </script>
</body>
</html>`;
    res.send(html);
  } catch (err) {
    res.status(500).send("Lỗi server");
  }
});

/* ------------- FRONTEND FALLBACK -------------- */

/* Removed fallback to allow serving individual HTML files from public/ */

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log("Server running on port", PORT));
