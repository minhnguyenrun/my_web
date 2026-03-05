# 📁 Project Structure

## Cấu Trúc Thư Mục Hiện Tại

```
firstweb/
├── 📁 public/                    # Static website files
│   ├── 📁 assets/                # Static assets
│   │   ├── 📁 css/               # CSS stylesheets (nếu có external CSS)
│   │   └── 📁 images/            # Images (nếu cần)
│   │
│   ├── 📁 scholarships/          # Scholarship detail pages
│   │   ├── hoc-bong-stem.html    # STEM scholarship
│   │   └── hoc-bong-kinh-te.html # Economics scholarship
│   │
│   ├── index.html                # Homepage
│   ├── about.html                # About page
│   └── profiles.html             # Scholarship application guide
│
├── 📁 server/                    # Node.js server
│   ├── app.js                    # Express app configuration
│   ├── index.js                  # Server entry point
│   ├── package.json              # Server dependencies
│   └── package-lock.json         # Dependency lock file
│
├── 📁 docs/                      # Documentation
│   ├── README.md                 # Project documentation
│   ├── REDESIGN-GUIDE.md         # Design customization guide
│   ├── REDESIGN-SUMMARY.md       # Redesign summary
│   ├── HUONG-DAN-THEM-HOC-BONG.md # How to add scholarships
│   └── TOM-TAT-THAY-DOI.md       # Change summary
│
├── 📁 .git/                      # Git repository
├── 📁 .github/                   # GitHub configuration
│
└── README.md                     # Main README
```

---

## Chi Tiết Từng Thư Mục

### 📂 `public/`
**Mục đích**: Chứa tất cả static HTML pages của website

**Cấu trúc**:
- **HTML Pages** (root level):
  - `index.html` - Trang chủ với danh sách học bổng
  - `about.html` - Trang giới thiệu về Scholar Share
  - `profiles.html` - Hướng dẫn chuẩn bị hồ sơ học bổng

- **`scholarships/`** - Thư mục chứa chi tiết học bổng:
  - Mỗi học bổng là 1 file HTML riêng
  - Naming convention: `hoc-bong-[ten].html`
  - Hiện có: STEM, Kinh Tế

- **`assets/`** - Static resources:
  - `css/` - External CSS files (nếu có)
  - `images/` - Hình ảnh (logo, icons, etc.)

**Lưu ý**:
- Tất cả CSS hiện tại đều inline trong HTML (không cần external files)
- Mỗi page có theme màu riêng với gradient design

---

### 📂 `server/`
**Mục đích**: Node.js Express server để serve static files

**Files**:
- `app.js` - Express application setup:
  ```javascript
  // Static file serving
  app.use(express.static(path.join(__dirname, "../public")));
  
  // Scholarship routing
  app.get('/scholarships/:filename', (req, res) => {...});
  ```

- `index.js` - Server entry point:
  ```javascript
  // Starts server on port 3000
  app.listen(3000, () => {...});
  ```

- `package.json` - Dependencies:
  - `express` ^4.19.2
  - `cors` ^2.8.5

**Chức năng**:
- ✅ Serve static HTML/CSS/JS
- ✅ Handle scholarship page routing
- ❌ NO database operations
- ❌ NO API endpoints
- ❌ NO file uploads

---

### 📂 `docs/`
**Mục đích**: Chứa tất cả documentation và guides

**Files**:
1. **README.md** - Overview của project
2. **REDESIGN-GUIDE.md** - Hướng dẫn custom màu sắc và effects:
   - Color schemes
   - Animation guides
   - Shadow effects
   - Hover effects
   - Responsive breakpoints

3. **REDESIGN-SUMMARY.md** - Tổng kết redesign:
   - Pages redesigned
   - Effects added
   - Color palettes
   - Best practices

4. **HUONG-DAN-THEM-HOC-BONG.md** - Hướng dẫn thêm học bổng:
   - File structure
   - Step-by-step tutorial
   - Color customization
   - URL patterns

5. **TOM-TAT-THAY-DOI.md** - Summary of major changes:
   - Completed tasks
   - New structure
   - Workflow changes

---

## Các Files/Folders Đã Xóa

### ❌ Database Related (không còn dùng):
```
✗ init.sql                    # Database schema
✗ sample.sql                  # Sample data
✗ database.db                 # SQLite database
✗ server/db.js                # Database connection
✗ server/insert.js            # Database operations
✗ server/.env                 # Environment variables
✗ server/routes/              # All API routes:
  ✗ applications.js
  ✗ scholarships.js
  ✗ pages.js
  ✗ page-editor.js
  ✗ uploads.js
  ✗ users.js
```

### ❌ Admin & Editor Pages (không còn dùng):
```
✗ public/admin.html           # Admin panel
✗ public/form-editor.html     # Form editor
✗ public/page-editor.html     # Page editor
✗ public/apply.html           # Application form (cần database)
✗ public/detail.html          # Old detail page
✗ public/scholarship.html     # Old scholarship page
```

### ❌ Temporary & Upload Folders:
```
✗ public/temp/                # Temporary files
✗ public/uploads/             # Old uploads
✗ server/public/uploads/      # Server uploads
```

### ❌ Test & Misc Files:
```
✗ test.json                   # Test data
✗ test2.json                  # Test data
✗ package.json (root)         # Root package (không cần)
```

---

## Workflow Hiện Tại

### Thêm Học Bổng Mới:

1. **Copy template**:
   ```bash
   cp public/scholarships/hoc-bong-stem.html public/scholarships/hoc-bong-moi.html
   ```

2. **Edit content**:
   - Đổi title
   - Đổi màu gradient trong `:root`
   - Update nội dung (value, conditions, benefits, etc.)
   - Thay image URL

3. **Add to homepage**:
   - Mở `public/index.html`
   - Thêm card mới trong `.scholarships-grid`

### Chỉnh Sửa Design:

1. **Đổi màu toàn bộ page**:
   ```css
   /* Trong <style> của page */
   :root {
     --primary-gradient: linear-gradient(135deg, #màu1, #màu2);
     --dark-gradient: linear-gradient(135deg, #màu3, #màu4);
   }
   ```

2. **Thêm/sửa animations**:
   - Tìm `@keyframes` section
   - Add/modify animations
   - Apply với `animation: name duration timing`

3. **Adjust spacing/sizing**:
   - Tìm class cần sửa
   - Update padding, margin, font-size
   - Check responsive breakpoints (@media)

### Chạy Server:

```bash
# Development
cd server
node app.js

# Access tại: http://localhost:3000
```

---

## Best Practices

### File Organization:
✅ Một học bổng = 1 file HTML trong `scholarships/`  
✅ Documentation trong `docs/`  
✅ Assets trong `public/assets/`  
✅ Naming convention rõ ràng  

### Code Style:
✅ Inline CSS để dễ maintain  
✅ CSS variables cho consistency  
✅ Comments cho các sections quan trọng  
✅ Semantic HTML structure  

### Git Workflow:
✅ Commit sau mỗi major change  
✅ Meaningful commit messages  
✅ Keep docs updated  

---

## Dependencies

### Server (Node.js):
```json
{
  "express": "^4.19.2",
  "cors": "^2.8.5"
}
```

### Frontend (CDN):
- **Fonts**: Google Fonts
  - Poppins (400/500/600/700)
  - Playfair Display (700/900)

- **No JavaScript libraries** - Pure vanilla JS (if needed)

---

## Port Configuration

- **Development**: `3000`
- **Production**: Configure in hosting platform

---

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

**Note**: Uses modern CSS (backdrop-filter, CSS Grid, etc.)

---

## Future Enhancements (Optional)

### Potential Additions:
- 📱 PWA support
- 🌙 Dark mode toggle
- 🔍 Search functionality
- 🌐 Multi-language support (EN/VI)
- 📊 Google Analytics
- 🎨 Theme customizer UI

### Not Needed:
- ❌ Database (static is simpler)
- ❌ User authentication
- ❌ Admin panel (edit HTML directly)
- ❌ File uploads
- ❌ Complex build tools

---

## Maintenance

### Regular Tasks:
- Update scholarship deadlines
- Add new scholarships
- Update about page content
- Refresh design/colors if needed

### Technical:
- Update Node.js dependencies: `npm update`
- Check for security vulnerabilities: `npm audit`
- Test on different browsers/devices

---

## Contact & Support

Xem [docs/README.md](docs/README.md) để biết thêm chi tiết về project.

---

**Last Updated**: March 5, 2026  
**Project**: Scholar Share - Scholarship Information Platform  
**Architecture**: Static HTML + Express Static Server
