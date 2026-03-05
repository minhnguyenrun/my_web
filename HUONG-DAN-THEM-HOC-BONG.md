# Hướng Dẫn Thêm Học Bổng Mới

## Cấu trúc project đã được đơn giản hóa

Project của bạn đã được chuyển đổi từ hệ thống database sang hệ thống **Static HTML**. 

### Các thay đổi chính:

1. ✅ **Không còn sử dụng database** - Tất cả dữ liệu được lưu dưới dạng file HTML
2. ✅ **Đã xóa trang quản lý Admin** - Chỉnh sửa nội dung trực tiếp trong code
3. ✅ **Đã xóa các dependencies không cần thiết** - Chỉ giữ lại Express và CORS
4. ✅ **Server đơn giản** - Chỉ phục vụ static files

---

## 📁 Cấu trúc thư mục học bổng

Tất cả các file HTML của học bổng được lưu trong thư mục:

```
public/scholarships/
```

### Các file mẫu đã tạo:

1. **hoc-bong-stem.html** - Học bổng STEM 2026
2. **hoc-bong-kinh-te.html** - Học bổng Kinh tế Xuất sắc

---

## 🆕 Cách thêm học bổng mới

### Bước 1: Tạo file HTML mới

Tạo một file HTML mới trong thư mục `public/scholarships/`

Ví dụ: `public/scholarships/hoc-bong-y-khoa.html`

### Bước 2: Copy template từ file mẫu

Copy toàn bộ nội dung từ file `hoc-bong-stem.html` hoặc `hoc-bong-kinh-te.html`

### Bước 3: Chỉnh sửa nội dung

Chỉnh sửa các phần sau trong file HTML mới:

#### 3.1. Trong thẻ `<head>`
```html
<title>Tên Học Bổng - Scholar Share</title>
```

#### 3.2. Trong phần header
```html
<div class="scholarship-header">
  <h1>Tên Học Bổng</h1>
  <p style="font-size: 20px; margin: 10px 0;">Mô tả ngắn</p>
  <div class="deadline">
    ⏰ Hạn nộp: DD/MM/YYYY
  </div>
</div>
```

#### 3.3. Ảnh đại diện
```html
<img src="URL_ẢNH" alt="Tên học bổng" class="scholarship-image">
```

**Gợi ý nguồn ảnh miễn phí:**
- Unsplash: https://unsplash.com
- Pexels: https://www.pexels.com

#### 3.4. Các section nội dung

Chỉnh sửa các section:
- 💰 Giá trị học bổng
- ✅ Điều kiện ứng tuyển
- 🎁 Quyền lợi
- 📝 Quy trình đăng ký
- 📞 Thông tin liên hệ

#### 3.5. Link đăng ký
```html
<a href="/apply.html?scholarship=ten-hoc-bong" class="apply-button">
  📄 Đăng Ký Ngay
</a>
```

### Bước 4: Thêm vào trang chủ

Mở file `public/index.html` và thêm card học bổng mới:

```html
<!-- Thêm vào trong <div class="scholarships-grid"> -->
<div class="scholarship" onclick="window.location.href='/scholarships/ten-file.html'">
  <img src="URL_ẢNH" alt="Tên học bổng">
  <div class="content">
    <h3>Tên Học Bổng</h3>
    <p>Mô tả ngắn</p>
    <small>Deadline: DD/MM/YYYY</small>
  </div>
</div>
```

---

## 🎨 Tùy chỉnh màu sắc

Mỗi học bổng có thể có gradient màu riêng. Để thay đổi màu:

### Trong .scholarship-header
```css
background: linear-gradient(135deg, #màu1 0%, #màu2 100%);
```

**Gợi ý gradient:**
- STEM (xanh tím): `#667eea 0%, #764ba2 100%`
- Kinh tế (hồng đỏ): `#f093fb 0%, #f5576c 100%`
- Y khoa (xanh lá): `#11998e 0%, #38ef7d 100%`
- Nghệ thuật (cam vàng): `#f857a6 0%, #ff5858 100%`

### Thay đổi màu border và button
Tìm các dòng có màu và thay đổi:
```css
border-left: 4px solid #MÀU;  /* Màu border cho summary */
border-bottom: 2px solid #MÀU;  /* Màu border cho section title */
background: linear-gradient(...);  /* Màu button */
```

---

## 🚀 Chạy project

### Cài đặt dependencies mới:
```bash
cd server
npm install
```

### Chạy server:
```bash
npm start
```

Server sẽ chạy trên: http://localhost:3000

---

## 📝 Lưu ý quan trọng

1. **Đặt tên file:** Sử dụng chữ thường, không dấu, ngăn cách bằng dấu gạch ngang
   - ✅ Đúng: `hoc-bong-y-khoa.html`
   - ❌ Sai: `Học Bổng Y Khoa.html`

2. **URL trong apply button:** Phải khớp với tên file (không có .html)
   ```html
   ?scholarship=hoc-bong-y-khoa
   ```

3. **Ảnh:** Nên sử dụng ảnh có kích thước phù hợp (1200x400px) để tối ưu tốc độ

4. **Backup:** Luôn backup file trước khi chỉnh sửa

---

## 🔧 Cấu trúc file HTML mẫu

Mỗi file học bổng bao gồm:

```
<!DOCTYPE html>
<html>
<head>
  - Meta tags
  - Title
  - CSS styles
</head>
<body>
  - Sidebar (menu điều hướng)
  - Main wrapper
    - Top header
    - Hero section
    - Container
      - Scholarship header (tên + deadline)
      - Scholarship image
      - Summary
      - Sections (giá trị, điều kiện, quyền lợi...)
      - Apply button
  - Footer
</body>
</html>
```

---

## 📞 Hỗ trợ

Nếu cần thêm tính năng hoặc gặp vấn đề, hãy liên hệ hoặc tham khảo file mẫu đã có.

**Các file quan trọng:**
- `public/scholarships/` - Thư mục chứa tất cả học bổng
- `public/index.html` - Trang chủ (danh sách học bổng)
- `server/app.js` - Server đơn giản
- `server/package.json` - Dependencies

---

## ✨ Ví dụ workflow

1. Copy `hoc-bong-stem.html` thành `hoc-bong-moi.html`
2. Mở file và tìm kiếm "STEM" để thay thế bằng tên học bổng mới
3. Thay đổi URL ảnh, màu sắc, nội dung các section
4. Lưu file
5. Mở `index.html` và thêm card mới
6. Chạy `npm start` để xem kết quả

Chúc bạn thành công! 🎉
