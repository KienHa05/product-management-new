const Order = require("../../models/order.model");

const productsHelper = require("../../helpers/products");

const orderStatusMapConstants = require("../../constants/orderStatusMap");

// [GET] /admin/orders
module.exports.index = async (req, res) => {
  const find = {
    deleted: false
  };

  const sort = {
    createdAt: "desc"
  };

  const ordersDocs = await Order.find(find).sort(sort);

  const orders = ordersDocs.map((order) => {
    // Tổng số lượng sản phẩm
    const totalQuantity = order.products.reduce((sum, p) => sum + p.quantity, 0);

    // Tổng tiền đơn hàng (đã áp dụng giảm giá của từng sản phẩm)
    const totalPrice = order.products.reduce((sum, p) => {
      const priceNew = productsHelper.priceNewProduct(p);
      return sum + priceNew * p.quantity;
    }, 0);

    // Định dạng tiền tệ (không hiển thị số lẻ)
    const totalPriceFormatted = totalPrice.toLocaleString();

    // Lấy thông tin trạng thái từ hằng số
    const statusData = orderStatusMapConstants[order.status] || {
      label: "Không rõ",
      className: "badge badge-light",
    };

    // Thêm các trường mới trực tiếp vào document
    order.totalQuantity = totalQuantity;
    order.totalPrice = totalPrice;
    order.totalPriceFormatted = totalPriceFormatted;
    order.statusData = statusData;

    return order;
  });

  res.render("admin/pages/orders/index", {
    pageTitle: "Quản Lí Đơn Hàng",
    orders: orders
  });
};



