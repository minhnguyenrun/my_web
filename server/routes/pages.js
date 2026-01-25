import express from 'express';
import pool from '../db.js';
import path from 'path';

const router = express.Router();

router.get('/detail/:id', async (req, res) => {
  try {
    const s = await pool.get('SELECT * FROM scholarships WHERE id=?', [req.params.id]);
    if (!s) return res.status(404).send('Không tìm thấy học bổng');

    const sections = await pool.all('SELECT * FROM sections WHERE scholarship_id=? ORDER BY order_index', [req.params.id]);
    s.sections = sections;

    let contentHtml = '';
    if (s.sections && s.sections.length > 0) {
      s.sections.forEach(section => {
        if (section.type === 'image') {
          contentHtml += `<img src="${section.content}" alt="Scholarship image" style="max-width:100%; display:block; margin:20px 0;"><br>`;
        } else {
          contentHtml += `<div style="margin:20px 0; line-height:1.6;">${section.content || ''}</div>`;
        }
      });
    } else {
      contentHtml = '<div style="margin:20px 0;">Chưa có nội dung</div>';
    }

    let hasForm = false;
    let formHtml = '';
    try {
      const fields = JSON.parse(s.form || '[]');
      hasForm = fields.length > 0;
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
      hasForm = true; // mặc định có form
    }

    const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Scholar Share - Chi Tiết Học Bổng</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary-dark: #1a2533; 
      --dropdown-bg: #1e1e1e;
    }

    body {
      font-family: 'Inter', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #ffffff;
      color: #333;
    }

    /* Top Bar */
    .top-header {
      background-color: var(--primary-dark);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 40px;
      color: white;
      font-size: 14px;
      position: relative;
      z-index: 1000;
    }

    #current-page-name {
      font-weight: 400;
      color: rgba(255,255,255,0.7);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* Dropdown */
    .dropdown {
      position: relative;
      cursor: pointer;
    }

    .dropdown-label {
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .dropdown-content {
      display: none;
      position: absolute;
      right: 0;
      top: 100%;
      background-color: var(--dropdown-bg);
      min-width: 240px;
      box-shadow: 0px 10px 20px rgba(0,0,0,0.4);
      padding: 10px 0;
      margin-top: 15px;
    }

    .dropdown-content a {
      color: #bbbbbb;
      padding: 15px 25px;
      text-decoration: none;
      display: block;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: all 0.2s;
    }

    .dropdown-content a:hover {
      background-color: #2a2a2a;
      color: white;
      padding-left: 30px;
    }

    .show { display: block; }

    /* Hero Section */
    .hero-section {
      background-color: var(--primary-dark);
      height: 280px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .logo-box {
      border: 3px solid white;
      padding: 20px 60px;
    }

    .logo-box h1 {
      font-family: 'Playfair Display', serif;
      color: white;
      font-size: 50px;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 3px;
    }

    /* Nội dung chính */
    .container {
      max-width: 1200px;
      margin: 40px auto;
      padding: 0 20px;
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
    <div class="top-header">
      <span id="current-page-name">CHI TIẾT HỌC BỔNG</span>
      
      <div class="dropdown">
        <div class="dropdown-label" onclick="toggleMenu()">
          Trang chủ <span style="font-size: 10px;">▼</span>
        </div>
        <div class="dropdown-content" id="myDropdown">
          <a href="/index.html">Trang Chủ</a>
          <a href="/about.html">Về Chúng Tôi</a>
          <a href="/admin.html">Quản Lý</a>
          <a href="/profiles.html">Hồ Sơ Học Bổng</a>
        </div>
      </div>
    </div>

    <div class="hero-section">
      <div class="logo-box">
        <h1>SCHOLAR SHARE</h1>
      </div>
    </div>
  </header>

  <div class="container">
    <h1 style="text-align: center; margin: 20px 0; color: #495057;">${s.title || "Không có tiêu đề"}</h1>
    <div id="content">${contentHtml}</div>
    <div id="actions">
      ${hasForm ? '<button id="apply-btn" class="btn">Gửi Đăng Ký</button>' : ''}
    </div>
  </div>

  <script>
    const scholarshipData = ${JSON.stringify(s)};

    const applyBtn = document.getElementById('apply-btn');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        window.location.href = '/apply.html?id=' + encodeURIComponent(scholarshipData.id);
      });
    }

    function toggleMenu() {
      document.getElementById("myDropdown").classList.toggle("show");
    }

    window.onclick = function(event) {
      if (!event.target.matches('.dropdown-label')) {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
          if (dropdowns[i].classList.contains('show')) {
            dropdowns[i].classList.remove('show');
          }
        }
      }
    }
  </script>
</body>
</html>`;

    res.send(html);
  } catch (err) {
    res.status(500).send('Lỗi server');
  }
});

router.get('/applications/:id', async (req, res) => {
  try {
    const s = await pool.get('SELECT * FROM scholarships WHERE id=?', [req.params.id]);
    if (!s) return res.status(404).send('Không tìm thấy học bổng');

    const applications = await pool.all('SELECT * FROM applications WHERE scholarship_id=? ORDER BY created_at DESC', [req.params.id]);

    let applicationsHtml = '';
    if (applications.length === 0) {
      applicationsHtml = '<p>Chưa có đơn đăng ký nào.</p>';
    } else {
      applicationsHtml = '<table style="width:100%; border-collapse:collapse;"><thead><tr><th style="border:1px solid #ddd; padding:8px;">Thời gian</th><th style="border:1px solid #ddd; padding:8px;">Dữ liệu</th></tr></thead><tbody>';
      applications.forEach(app => {
        applicationsHtml += `<tr><td style="border:1px solid #ddd; padding:8px;">${new Date(app.created_at).toLocaleString('vi-VN')}</td><td style="border:1px solid #ddd; padding:8px;">${JSON.stringify(app.data)}</td></tr>`;
      });
      applicationsHtml += '</tbody></table>';
    }

    const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Danh Sách Đăng Ký - ${s.title || "Học Bổng"}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #ffffff; color: #333; margin: 0; padding: 0; line-height: 1.6; }
    header { background-color: #f8f9fa; padding: 10px 20px; border-bottom: 1px solid #e9ecef; display: flex; justify-content: space-between; align-items: center; }
    header h1 { margin: 0; color: #495057; }
    nav { display: flex; gap: 20px; }
    nav a { text-decoration: none; color: #007bff; font-weight: bold; padding: 10px; border-radius: 5px; transition: background-color 0.3s; }
    nav a:hover { background-color: #e9ecef; }
    .container { max-width: 1200px; margin: 20px auto; padding: 0 20px; }
    .btn { display: inline-block; padding: 10px 20px; background-color: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; transition: background-color 0.3s; }
    .btn:hover { background-color: #218838; }
    .btn-secondary { background-color: #6c757d; }
    .btn-secondary:hover { background-color: #5a6268; }
    .back-btn { background-color: #6c757d; margin-bottom: 20px; }
    .back-btn:hover { background-color: #5a6268; }

    .ql-size-small { font-size: 0.75em; }
    .ql-size-large { font-size: 1.5em; }
    .ql-size-huge { font-size: 2.5em; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
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
    <h1>Danh Sách Đăng Ký: ${s.title || "Học Bổng"}</h1>
  </header>
  <div class="container">
    <button class="btn back-btn" onclick="history.back()">Quay Lại</button>
    <button class="btn btn-secondary" onclick="exportExcel(${s.id})">Xuất Excel</button>
    <div id="applications">${applicationsHtml}</div>
  </div>

  <script>
    function exportExcel(id) {
      window.open('/api/scholarships/' + id + '/export', '_blank');
    }
  </script>
</body>
</html>`;

    res.send(html);
  } catch (err) {
    res.status(500).send('Lỗi server');
  }
});

export default router;
