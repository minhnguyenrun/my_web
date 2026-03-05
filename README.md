# 🎓 Scholar Share

> **Nền tảng chia sẻ thông tin học bổng cho sinh viên Việt Nam**

Website static hiện đại với gradient design, animations và responsive layout.

---

## ✨ Tính Năng

- 🎨 **Modern Design**: Gradient themes, glassmorphism effects, smooth animations
- 📱 **Responsive**: Hoạt động tốt trên desktop, tablet và mobile
- ⚡ **Fast**: Static HTML - không cần database, load nhanh
- 🎯 **Simple**: Dễ thêm/sửa học bổng - chỉ cần edit HTML
- 📚 **Well Documented**: Hướng dẫn đầy đủ trong folder `docs/`

---

## 🚀 Quick Start

### 1. Cài Đặt Dependencies

```bash
cd server
npm install
```

### 2. Chạy Server

```bash
node app.js
```

Server chạy tại: **http://localhost:3000**

---

## 📁 Cấu Trúc Project

```
firstweb/
├── public/              # Static HTML pages
│   ├── index.html       # Homepage
│   ├── about.html       # About page
│   ├── profiles.html    # Application guide
│   ├── scholarships/    # Scholarship details
│   └── assets/          # CSS, images
│
├── server/              # Node.js server
│   ├── app.js           # Express config
│   ├── index.js         # Entry point
│   └── package.json     # Dependencies
│
└── docs/                # Documentation
    ├── REDESIGN-GUIDE.md
    ├── REDESIGN-SUMMARY.md
    └── HUONG-DAN-THEM-HOC-BONG.md
```

📖 **[Xem cấu trúc chi tiết →](STRUCTURE.md)**

---

## 📄 Pages

### Homepage (`index.html`)
- Danh sách học bổng với cards
- Animated hero section
- Modern gradient theme (blue-purple)

### About (`about.html`)
- Giới thiệu về Scholar Share
- Mission, vision, values
- Contact information

### Profiles (`profiles.html`)
- Hướng dẫn chuẩn bị hồ sơ học bổng
- Tips & best practices
- Timeline chuẩn bị

### Scholarship Details (`scholarships/*.html`)
- Chi tiết từng học bổng
- Điều kiện, quyền lợi, quy trình
- Call-to-action buttons

---

## 🎨 Design System

### Color Schemes

**Blue-Purple** (Index, About):
```css
--primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

**Green** (Profiles):
```css
--primary-gradient: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
```

**Pink-Red** (Economics Scholarship):
```css
--primary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
```

### Typography
- **Body**: Poppins (400/500/600/700)
- **Headings**: Playfair Display (700/900)

📖 **[Xem design guide →](docs/REDESIGN-GUIDE.md)**

---

## 📝 Thêm Học Bổng Mới

### Method 1: Copy Template

```bash
# Windows PowerShell
Copy-Item public/scholarships/hoc-bong-stem.html public/scholarships/hoc-bong-moi.html
```

### Method 2: Edit Content

1. Mở file HTML vừa copy
2. Đổi title: `<title>Học Bổng Mới - Scholar Share</title>`
3. Đổi màu trong `:root` section
4. Update content trong các sections
5. Thay image URL

### Method 3: Add to Homepage

Mở `public/index.html`, thêm card mới:

```html
<a href="/scholarships/hoc-bong-moi.html" class="scholarship-card">
  <div class="card-icon">🎯</div>
  <h3>Học Bổng Mới</h3>
  <p>Mô tả học bổng...</p>
  <span class="card-arrow">→</span>
</a>
```

📖 **[Hướng dẫn chi tiết →](docs/HUONG-DAN-THEM-HOC-BONG.md)**

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (no frameworks)
- **Backend**: Node.js + Express (static file server)
- **Fonts**: Google Fonts (CDN)
- **Architecture**: Static site (no database)

### Dependencies

```json
{
  "express": "^4.19.2",
  "cors": "^2.8.5"
}
```

---

## 🎯 Why Static?

✅ **Đơn giản**: Không cần database, không cần API  
✅ **Nhanh**: Load time cực nhanh  
✅ **Dễ maintain**: Chỉnh sửa trực tiếp HTML  
✅ **Dễ deploy**: Host ở bất kỳ đâu (Vercel, Netlify, GitHub Pages)  
✅ **Ít bug**: Ít moving parts = ít lỗi  

---

## 📚 Documentation

- 📖 [Project Structure](STRUCTURE.md) - Chi tiết cấu trúc folders/files
- 🎨 [Design Guide](docs/REDESIGN-GUIDE.md) - Hướng dẫn custom màu và effects
- 📝 [Redesign Summary](docs/REDESIGN-SUMMARY.md) - Tổng kết redesign
- ➕ [Thêm Học Bổng](docs/HUONG-DAN-THEM-HOC-BONG.md) - Step-by-step guide
- 📋 [Change Log](docs/TOM-TAT-THAY-DOI.md) - Lịch sử thay đổi

---

## 🌐 Deployment

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Option 2: Netlify

1. Kéo thả folder `public/` vào Netlify
2. Done!

### Option 3: Traditional Hosting

1. Upload toàn bộ project
2. Point webserver đến `public/` folder
3. Hoặc chạy Node.js server với `node server/app.js`

---

## 🤝 Contributing

Nếu muốn góp ý hoặc báo lỗi:

1. Fork repository
2. Tạo branch mới: `git checkout -b feature/ten-tinh-nang`
3. Commit changes: `git commit -m 'Add some feature'`
4. Push branch: `git push origin feature/ten-tinh-nang`
5. Tạo Pull Request

---

## 📄 License

Dự án mã nguồn mở - sử dụng tự do cho mục đích giáo dục.

---

## 📧 Contact

- **Website**: http://localhost:3000
- **Facebook**: [Thêm link Facebook Page]
- **Email**: [Thêm email]

---

**Built with ❤️ for Vietnamese students**  
**Last Updated**: March 5, 2026