const Order = require("../../models/order.model");
const Product = require("../../models/product.model");

const systemConfig = require("../../config/system");

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

// [GET] /admin/orders/detail/:orderId
module.exports.detail = async (req, res) => {
  try {
    const { orderId } = req.params;

    const find = {
      _id: orderId,
      deleted: false
    };

    const order = await Order.findOne(find);

    if (!order) {
      return res.status(404).render("client/pages/errors/404", {
        pageTitle: "Không Tìm Thấy Đơn Hàng",
      });
    }

    // Tổng số lượng sản phẩm
    order.totalQuantity = order.products.reduce((sum, p) => sum + p.quantity, 0);

    // Danh sách id sản phẩm để lấy thông tin chi tiết
    const productIds = order.products.map((p) => p.product_id);
    const productsDocs = await Product.find({ _id: { $in: productIds } }).select(
      "title thumbnail slug"
    );
    const productsMap = {};
    productsDocs.forEach((pd) => {
      productsMap[pd._id.toString()] = pd;
    });

    // Tính toán giá từng sản phẩm + tổng tiền và gắn thêm thông tin sản phẩm
    order.totalPrice = 0;
    order.products = order.products.map((p) => {
      // Giá sau giảm của từng sản phẩm
      const priceNew = productsHelper.priceNewProduct(p);
      p.priceNew = priceNew;

      // Thành tiền của sản phẩm
      order.totalPrice += priceNew * p.quantity;

      // Thông tin sản phẩm (title, thumbnail, slug)
      const doc = productsMap[p.product_id];
      if (doc) {
        p.product = {
          _id: doc._id,
          title: doc.title,
          thumbnail: doc.thumbnail,
          slug: doc.slug,
        };
      }

      return p;
    });

    order.totalPriceFormatted = order.totalPrice.toLocaleString();

    // Trạng thái
    order.statusData =
      orderStatusMapConstants[order.status] || {
        label: "Không rõ",
        className: "badge badge-light",
      };

    res.render("admin/pages/orders/detail", {
      pageTitle: "Chi Tiết Đơn Hàng",
      order: order
    })
  } catch (error) {
    console.log(error);
    res.redirect(`${systemConfig.prefixAdmin}/orders`);
  }
};

// [DELETE] /admin/orders/delete/:orderId
module.exports.deleteItem = async (req, res) => {
  const orderId = req.params.orderId;

  await Order.updateOne({ _id: orderId }, {
    deleted: true,
  });

  req.flash("success", `Đã Xóa Thành Công Bài Viết Này!`);

  res.redirect(req.get("Referrer") || "/");
};



