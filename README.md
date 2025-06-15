
# 🛍️ Product Management - Quản Lý Sản Phẩm (Dự án cá nhân)

## 📌 Giới thiệu
**Product Management System** là một ứng dụng web được xây dựng bằng Node.js, hỗ trợ quản lý và hiển thị sản phẩm với hai vai trò chính:
- **Admin**: Quản lý toàn bộ hệ thống sản phẩm, tài khoản, blog, và cài đặt.
- **Client**: Giao diện người dùng cuối để xem sản phẩm, tìm kiếm, thêm vào giỏ hàng và đặt hàng cơ bản.

## 🔑 Phân quyền hệ thống
### Admin
- Đăng nhập hệ thống quản trị
- Quản lý sản phẩm và danh mục sản phẩm
- Quản lý tài khoản, phân quyền thủ công
- Quản lý blog, cài đặt hệ thống, thống kê căn bản

### Client
- Xem và tìm kiếm sản phẩm
- Xem blog, chi tiết sản phẩm
- Giỏ hàng, đặt hàng
- Tính năng chat và tương tác trực tiếp (khi đăng nhập thành công)

## 🛠️ Công nghệ sử dụng
- **Backend**: Node.js, Express.js
- **Cơ sở dữ liệu**: MongoDB (tích hợp với Mongoose)
- **Xác thực & Phân quyền**: Middleware,
- **Upload ảnh**: Cloudinary
- **Realtime Chat**: rooms-chat (có thể dùng socket.io)
- **Triển khai**: Hỗ trợ deploy qua Vercel,Render

## 🚀 Hướng dẫn chạy dự án
1. **Clone dự án**
```bash
git clone https://github.com/KienHa05/product-management-new.git
cd product-management
```

2. **Cài đặt thư viện**
```bash
npm install
```

3. **Cấu hình biến môi trường (.env)**

Tạo file `.env` và thiết lập các biến cần thiết như kết nối DB, JWT_SECRET, v.v. Liên hệ với nhà phát triển để có thông tin .env

4. **Chạy dự án**
```bash
npm start
npm run dev
```

## 📦 Cấu trúc thư mục chính
```
product-management/
├── controllers/
│   ├── admin/         # Controller cho Admin
│   └── client/        # Controller cho Client
├── middlewares/       # Middleware xác thực, phân quyền
├── helpers/           # Hàm hỗ trợ như phân trang, upload, tìm kiếm
├── constants/         # Các giá trị dùng chung: permission, status, sort
├── config/            # Kết nối cơ sở dữ liệu, cấu hình hệ thống
├── index.js           # Điểm khởi chạy chính
├── vercel.json        # Cấu hình deploy
└── package.json
```

## 📧 Liên hệ
Liên hệ phát triển: `kienhgph50150@gmail.com`

---
**© 2025 Product Management - All rights reserved.**
