module.exports = {
  // Danh Mục Sản Phẩm || Sản Phẩm => Primary, Success, Danger
  productStatus: [
    { name: "Tất Cả", status: "", buttonColor: "primary" },
    { name: "Hoạt Động", status: "active", buttonColor: "success" },
    { name: "Dừng Hoạt Động", status: "inactive", buttonColor: "danger" }
  ],

  // Danh Mục Blog || Blog => Primary, Success, Warning
  blogStatus: [
    { name: "Tất Cả", status: "", buttonColor: "primary" },
    { name: "Công Khai", status: "published", buttonColor: "success" },
    { name: "Bản Nháp", status: "draft", buttonColor: "warning" }
  ],

  // Danh Mục Liên Hệ || Liên Hệ => Primary, Success, Warning
  contactStatus: [
    { name: "Tất Cả", status: "", buttonColor: "primary" },
    { name: "Đã Xử Lý", status: "resolved", buttonColor: "success" },
    { name: "Chờ Xử Lý", status: "pending", buttonColor: "warning" }
  ],

  // Danh Sách Đơn Hàng
  orderStatus: [
    { name: "Tất Cả", status: "", buttonColor: "dark" },
    { name: "Chờ Xử Lý", status: "pending", buttonColor: "warning" },
    { name: "Đã Xác Nhận", status: "confirmed", buttonColor: "info" },
    { name: "Đang Đóng Gói", status: "packing", buttonColor: "secondary" },
    { name: "Đang Vận Chuyển", status: "shipping", buttonColor: "primary" },
    { name: "Đã Giao", status: "delivered", buttonColor: "success" },
    { name: "Đã Hủy", status: "cancelled", buttonColor: "danger" }
  ]
};
