# 🎨 REDESIGN HOÀN TẤT - HƯỚNG DẪN TÙY CHỈNH

## ✨ **Đã Cập Nhật**

### 1. **Trang Chủ (index.html)** ✅
- Gradient background màu xanh tím fade
- Sidebar với hiệu ứng glow và shine
- Hero section với animation pulse
- Scholarship cards với hover effects 3D
- Shadow effects nhiều layers
- Footer với glassmorphism

### 2. **Trang Về Chúng Tôi (about.html)** ✅  
- Intro section gradient background
- Content sections với hover lift effects
- Value cards với gradient và animation
- Smooth scroll và fade-in animations

### 3. **CSS File Chung (css/modern-style.css)** ✅
- Design system với color variables
- Reusable animations
- Utility classes

---

## 🎨 **Color Scheme Hiện Tại**

> **⚠️ CẬP NHẬT MỚI**: Màu đã được đổi sang **Light Blue Gradient** thống nhất cho toàn website!

### Primary Colors:
```css
--primary-gradient: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%);
```
- **Màu chủ đạo**: Xanh dương nhạt gradient (Light Blue)
- **Dùng cho**: Buttons, headers, highlights, hero sections

### Dark Theme:
```css
--dark-gradient: linear-gradient(135deg, #3a6073 0%, #16222a 100%);
```
- **Màu tối**: Xanh grayish đậm gradient
- **Dùng cho**: Sidebar, header, footer

### Accent Colors:
```css
--secondary-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
--accent-gradient: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
```

📖 **[Xem chi tiết Color Palette →](COLOR-PALETTE.md)**

---

## 🛠️ **Cách Thay Đổi Màu Sắc**

### Thay đổi màu chủ đạo của toàn website:

1. **Mở file cần chỉnh sửa** (index.html, about.html, etc.)

2. **Tìm đến phần `:root` trong `<style>`**:
```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --dark-gradient: linear-gradient(135deg, #302b63 0%, #24243e 100%);
}
```

3. **Thay đổi màu theo ý muốn**:

#### ✅ Màu Hiện Tại: Light Blue (Đang dùng)
```css
:root {
  --primary-gradient: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%);
  --dark-gradient: linear-gradient(135deg, #3a6073 0%, #16222a 100%);
}
```

#### Ví dụ 1: Đổi sang màu Hồng - Cam
```css
:root {
  --primary-gradient: linear-gradient(135deg, #fa709a 0%, #ff6a00 100%);
  --dark-gradient: linear-gradient(135deg, #ee0979 0%, #ff6a00 100%);
}
```

#### Ví dụ 2: Đổi sang màu Xanh Lá - Xanh Dương
```css
:root {
  --primary-gradient: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  --dark-gradient: linear-gradient(135deg, #134e5e 0%, #71b280 100%);
}
```

#### Ví dụ 3: Đổi sang màu Đỏ - Tím
```css
:root {
  --primary-gradient: linear-gradient(135deg, #f857a6 0%, #ff5858 100%);
  --dark-gradient: linear-gradient(135deg, #c31432 0%, #240b36 100%);
}
```

#### Ví dụ 4: Đổi sang màu Xanh Dương Sang Trọng
```css
:root {
  --primary-gradient: linear-gradient(135deg, #0093E9 0%, #80D0C7 100%);
  --dark-gradient: linear-gradient(135deg, #141E30 0%, #243B55 100%);
}
```

---

## 💎 **Các Hiệu Ứng Shadows**

### Shadow Levels:

**Level 1 - Soft Shadow** (cho cards thường):
```css
box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
```

**Level 2 - Medium Shadow** (cho cards hover):
```css
box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
```

**Level 3 - Strong Shadow** (cho popups, modals):
```css
box-shadow: 
  0 30px 80px rgba(0, 0, 0, 0.2),
  0 10px 30px rgba(102, 126, 234, 0.3);
```

### Thay đổi màu shadow:

Màu shadow nên match với màu chủ đạo. Ví dụ:
- Gradient xanh tím → Shadow xanh tím: `rgba(102, 126, 234, 0.3)`
- Gradient hồng cam → Shadow hồng: `rgba(250, 112, 154, 0.3)`
- Gradient xanh lá → Shadow xanh: `rgba(17, 153, 142, 0.3)`

---

## ✨ **Animations Có Sẵn**

### 1. **Fade In Up**
```css
animation: fadeInUp 0.8s ease-out;
```
- Element xuất hiện từ dưới lên trên
- Dùng cho: Container, sections

### 2. **Slide In Down**
```css
animation: slideInDown 0.8s ease-out;
```
- Element trượt từ trên xuống
- Dùng cho: Headers, titles

### 3. **Glow Effect**
```css
animation: glow 3s ease-in-out infinite;
```
- Text sáng nhấp nháy nhẹ
- Dùng cho: Logo, important titles

### 4. **Pulse Effect**
```css
animation: pulse 8s ease-in-out infinite;
```
- Nhấp nháy opacity
- Dùng cho: Backgrounds, overlays

### 5. **Rotate Effect**
```css
animation: rotate 30s linear infinite;
```
- Xoay 360 độ liên tục
- Dùng cho: Background decorations

### 6. **Title Shine**
```css
animation: titleShine 5s ease-in-out infinite;
```
- Text shadow sáng lên
- Dùng cho: Hero titles

---

## 🎭 **Hover Effects**

### Card Lift Effect:
```css
.card {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  transform: translateY(-15px) scale(1.02);
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
}
```

### Button Scale Effect:
```css
.button:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}
```

### 3D Tilt Effect:
```css
.box:hover {
  transform: perspective(1000px) rotateX(5deg) translateY(-10px);
}
```

---

## 🌈 **Glassmorphism Effects**

### Style hiện đại với backdrop blur:

```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
}
```

Đã áp dụng cho:
- Sidebar header
- Footer social links
- Logo box

---

## 📱 **Responsive Design**

Breakpoint chính: **768px**

```css
@media (max-width: 768px) {
  .sidebar { width: 220px; }
  .main-wrapper { margin-left: 220px; }
  .logo-box h1 { font-size: 40px; }
  .scholarships-grid { grid-template-columns: 1fr; }
}
```

---

## 🚀 **Tối Ưu Performance**

### Các animations được tối ưu với:
1. **CSS transforms** thay vì top/left (GPU accelerated)
2. **will-change** property cho animations phức tạp
3. **transition-timing-function** với cubic-bezier mượt mà

### Cách thêm:
```css
.animated-element {
  will-change: transform, opcity;
  transform: translateZ(0); /* Force GPU */
}
```

---

## 🎯 **Best Practices**

### 1. **Màu Gradient**
- Luôn dùng 135deg cho góc nhìn đẹp
- Kết hợp màu có độ tương phản vừa phải
- Tránh quá nhiều màu trong 1 gradient

### 2. **Shadows**
- Dùng multiple shadows cho độ sâu
- Shadow color nên match với theme
- Hover state có shadow mạnh hơn

### 3. **Animations**
- Thời gian animation: 0.3s - 0.8s
- Dùng ease-out cho smooth endings
- Delay animation cho sequential effects

### 4. **Spacing**
- Padding: 25px - 50px cho sections
- Gap: 25px - 35px cho grids
- Margin: 30px - 50px giữa các elements

---

## 🎨 **Color Palette Suggestions**

### Theme 1: Ocean Blue
```css
--primary-gradient: linear-gradient(135deg, #2E3192 0%, #1BFFFF 100%);
--dark-gradient: linear-gradient(135deg, #0F2027 0%, #203A43 100%);
```

### Theme 2: Sunset Orange
```css
--primary-gradient: linear-gradient(135deg, #FF512F 0%, #F09819 100%);
--dark-gradient: linear-gradient(135deg, #2C3E50 0%, #4CA1AF 100%);
```

### Theme 3: Forest Green
```css
--primary-gradient: linear-gradient(135deg, #134E5E 0%, #71B280 100%);
--dark-gradient: linear-gradient(135deg, #0F2027 0%, #203A43 100%);
```

### Theme 4: Royal Purple
```css
--primary-gradient: linear-gradient(135deg, #360033 0%, #0b8793 100%);
--dark-gradient: linear-gradient(135deg, #200122 0%, #6f0000 100%);
```

### Theme 5: Rose Gold
```css
--primary-gradient: linear-gradient(135deg, #E8CBC0 0%, #636FA4 100%);
--dark-gradient: linear-gradient(135deg, #BE5869 0%, #403A3E 100%);
```

---

## 🔥 **Quick Tips**

1. **Thay đổi màu toàn bộ website**: Chỉ cần đổi 2 biến `--primary-gradient` và `--dark-gradient` trong `:root`

2. **Thêm animation mới**: Copy từ phần `@keyframes` và customize

3. **Điều chỉnh shadow**: Thay đổi giá trị blur (số thứ 3) và spread (số thứ 4)

4. **Tạo gradient mới**: Dùng https://cssgradient.io

5. **Test responsive**: Dùng DevTools và resize browser

---

## 📁 **Files Đã Update**

- ✅ `public/index.html` - Trang chủ với design mới
- ✅ `public/about.html` - Về chúng tôi với design mới  
- ⏳ `public/profiles.html` - Đang cập nhật...
- ⏳ `public/scholarships/*.html` - Đang cập nhật...

---

## ⚡ **Next Steps**

1. Cập nhật `profiles.html` với design mới
2. Cập nhật các file scholarship chi tiết
3. Thêm loading animations
4. Tối ưu mobile responsiveness
5. Add dark mode toggle (optional)

---

**Happy Designing! 🎨✨**

Nếu cần hỗ trợ thêm về màu sắc hoặc hiệu ứng, hãy cho tôi biết!
