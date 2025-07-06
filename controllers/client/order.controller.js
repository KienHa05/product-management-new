const Order = require("../../models/order.model");
const Cart = require("../../models/cart.model");

const productsHelper = require("../../helpers/products");

const orderStatusMapConstants = require("../../constants/orderStatusMap");

// [GET] /my-orders
module.exports.index = async (req, res) => {
  try {
    // Lấy tất cả cart thuộc về user (đã liên kết sau khi đăng nhập)
    const cartsOfUser = await Cart.find({ user_id: res.locals.user.id }).select("_id");
    const cartIds = cartsOfUser.map(c => c._id.toString());

    const find = {
      deleted: false,
      $or: [
        { user_id: res.locals.user.id },
        { cart_id: { $in: cartIds } }
      ]
    };

    const ordersDocs = await Order.find(find);

    // Bổ sung dữ liệu tính sẵn để View chỉ việc hiển thị
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

    res.render("client/pages/my-orders/index", {
      pageTitle: "Lịch Sử Mua Hàng",
      orders: orders
    });
  } catch (error) {
    console.error(`Có Lỗi Bên order.controller.js : ${error}`);
    res.status(500).send("Có lỗi xảy ra, vui lòng thử lại sau!");
  }
};

