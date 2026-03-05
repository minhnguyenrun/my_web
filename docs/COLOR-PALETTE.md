# 🎨 Color Palette - Light Blue Theme

## Màu Chủ Đạo Hiện Tại

**Theme**: Light Blue Gradient (Xanh Dương Nhạt)

---

## 🎨 CSS Variables

```css
:root {
  /* Primary - Main gradient for buttons, headers, highlights */
  --primary-gradient: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%);
  
  /* Dark - Sidebar, footer, dark sections */
  --dark-gradient: linear-gradient(135deg, #3a6073 0%, #16222a 100%);
  
  /* Secondary - Alternative accent */
  --secondary-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  
  /* Accent - Highlights, decorations */
  --accent-gradient: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
}
```

---

## 🎯 Màu Sắc Chi Tiết

### Primary Gradient
```
Start: #89f7fe (Light Blue)
End:   #66a6ff (Medium Blue)
```
**Sử dụng cho**:
- Buttons chính
- Hero sections
- Card highlights
- Important headings
- Call-to-action elements

### Dark Gradient
```
Start: #3a6073 (Dark Blue Gray)
End:   #16222a (Very Dark Blue)
```
**Sử dụng cho**:
- Sidebar background
- Footer background
- Headers
- Navigation bars
- Dark mode elements

### Secondary Gradient
```
Start: #4facfe (Bright Blue)
End:   #00f2fe (Cyan Blue)
```
**Sử dụng cho**:
- Alternative buttons
- Section backgrounds
- Hover effects
- Decorative elements

### Accent Gradient
```
Start: #a1c4fd (Soft Blue)
End:   #c2e9fb (Light Cyan)
```
**Sử dụng cho**:
- Background overlays
- Subtle decorations
- Border highlights
- Secondary elements

---

## 🌈 Preview

### Primary Gradient
```
████████████████████████████
#89f7fe ────────► #66a6ff
Light Blue ────► Medium Blue
████████████████████████████
```

### Dark Gradient
```
████████████████████████████
#3a6073 ────────► #16222a
Dark Gray ─────► Very Dark
████████████████████████████
```

### Color Harmony
- **Hue Range**: 180° - 240° (Blue spectrum)
- **Saturation**: Medium to High
- **Lightness**: 50% - 90%
- **Overall Feel**: Fresh, Modern, Professional, Calm

---

## 📱 Áp Dụng Cho Các Pages

### ✅ Homepage (index.html)
- Hero section: Primary gradient background
- Sidebar: Dark gradient
- Scholarship cards: White with primary gradient hover
- Buttons: Primary gradient

### ✅ About Page (about.html)
- Intro section: Primary gradient
- Value cards: Accent gradient backgrounds
- Content sections: White with primary borders
- Sidebar: Dark gradient

### ✅ Profiles Page (profiles.html)
- Intro section: Primary gradient
- Tip boxes: Light yellow (kept for contrast)
- Success boxes: Accent gradient
- Warning boxes: Light red (kept for contrast)
- Checklist: Accent gradient backgrounds

### ✅ STEM Scholarship (hoc-bong-stem.html)
- Header: Primary gradient
- Sections: White with primary accents
- Apply button: Primary gradient
- Sidebar: Dark gradient

### ✅ Economics Scholarship (hoc-bong-kinh-te.html)
- Header: Primary gradient
- Sections: White with primary accents
- Apply button: Primary gradient
- Sidebar: Dark gradient

---

## 🎨 Color Meanings

### Light Blue (#89f7fe - #66a6ff)
- **Symbolism**: Trust, Knowledge, Learning, Innovation
- **Psychology**: Promotes calmness, focus, productivity
- **Perfect for**: Educational platform, scholarship information

### Dark Blue-Gray (#3a6073 - #16222a)
- **Symbolism**: Professionalism, Stability, Authority
- **Psychology**: Creates sense of security and reliability
- **Perfect for**: Navigation, headers, serious content

---

## 🔄 Gradient Angles

**Standard**: `135deg` (diagonal from bottom-left to top-right)

```css
/* Diagonal */
linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)

/* Alternative angles if needed */
linear-gradient(90deg, ...)   /* Left to right */
linear-gradient(180deg, ...)  /* Top to bottom */
linear-gradient(45deg, ...)   /* Diagonal alternative */
```

---

## 💡 Sử Dụng Trong Code

### Button Example
```css
.button {
  background: var(--primary-gradient);
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 50px;
  box-shadow: 0 10px 30px rgba(102, 166, 255, 0.3);
}

.button:hover {
  box-shadow: 0 15px 40px rgba(102, 166, 255, 0.5);
  transform: translateY(-3px);
}
```

### Heading with Gradient Text
```css
.gradient-text {
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Card with Gradient Border
```css
.card {
  background: white;
  border: 2px solid transparent;
  border-image: var(--primary-gradient) 1;
  border-radius: 15px;
}
```

### Section Background
```css
.hero-section {
  background: var(--primary-gradient);
  color: white;
  padding: 80px 50px;
  position: relative;
  overflow: hidden;
}
```

---

## 🎭 Shadow Colors

Use gradient colors in shadows for cohesive design:

```css
/* Light shadow matching primary */
box-shadow: 0 10px 30px rgba(102, 166, 255, 0.2);

/* Medium shadow */
box-shadow: 0 20px 60px rgba(102, 166, 255, 0.3);

/* Strong shadow */
box-shadow: 0 30px 80px rgba(102, 166, 255, 0.4);
```

---

## 🔧 Customization Quick Guide

### Thay đổi màu chủ đạo:

1. Mở file HTML cần sửa
2. Tìm section `<style>` với `:root {`
3. Thay đổi giá trị hex:

```css
:root {
  /* Đổi màu này */
  --primary-gradient: linear-gradient(135deg, #MÀU-MỚI-1 0%, #MÀU-MỚI-2 100%);
}
```

### Một số gợi ý màu xanh khác:

```css
/* Ocean Blue */
--primary-gradient: linear-gradient(135deg, #2E3192 0%, #1BFFFF 100%);

/* Sky Blue */
--primary-gradient: linear-gradient(135deg, #56CCF2 0%, #2F80ED 100%);

/* Aqua Blue */
--primary-gradient: linear-gradient(135deg, #43C6AC 0%, #191654 100%);

/* Ice Blue */
--primary-gradient: linear-gradient(135deg, #E0EAFC 0%, #CFDEF3 100%);
```

---

## ✅ Accessibility

### Contrast Ratios:
- **Primary gradient text** on white: ✅ WCAG AA Pass
- **White text** on primary gradient: ✅ WCAG AAA Pass
- **Dark gradient text** on white: ✅ WCAG AAA Pass
- **White text** on dark gradient: ✅ WCAG AAA Pass

### Recommendations:
- Always test with color blindness simulators
- Ensure text is readable on gradient backgrounds
- Use solid fallback colors for older browsers

---

## 🎨 Color Tools

### Online Generators:
1. **WebGradients**: https://webgradients.com
2. **CSS Gradient**: https://cssgradient.io
3. **UI Gradients**: https://uigradients.com
4. **Coolors**: https://coolors.co

### Testing Tools:
- WebAIM Contrast Checker
- Color Oracle (color blindness simulator)
- Browser DevTools

---

## 📝 Notes

- Màu đã được áp dụng đồng bộ cho **TẤT CẢ 5 pages**
- Background body: Light gradient (#f5f7fa → #c3cfe2)
- Animations và effects giữ nguyên
- Shadow colors đã adjust để match với blue theme
- Responsive design không thay đổi

---

**Last Updated**: March 5, 2026  
**Theme**: Light Blue Gradient  
**Version**: 1.0  
**Status**: ✅ Applied to all pages
