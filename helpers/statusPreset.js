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
  ]
};
