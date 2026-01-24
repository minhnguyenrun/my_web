# Quản Lý Học Bổng Cho Sinh Viên

Dự án web quản lý học bổng với giao diện tinh tế, nền trắng.

## Cài Đặt

1. Cài đặt Node.js.
2. Chạy `npm install` trong thư mục server.
3. Chạy server: `npm start` (từ thư mục gốc)
   - Server chạy trên http://localhost:5001
   - Database SQLite tự tạo file database.db

## Sử Dụng

- Trang chủ: Xem danh sách học bổng.
- Chi tiết: Xem thông tin và đăng ký.
- Admin: Thêm học bổng mới tại `/admin.html` (đăng nhập: admin/password)

## Tính Năng

- Nội dung học bổng chia thành các mục như notebook.
- Form đăng ký động với các trường tùy chỉnh, tách riêng khỏi tạo học bổng.
- Quản lý đơn đăng ký và xuất Excel.
- Thanh navigation để chuyển trang.
- Bảo mật trang admin bằng tài khoản.