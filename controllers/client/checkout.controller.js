const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");

const productsHelper = require("../../helpers/products");
const sendMailHelper = require("../../helpers/sendMail");

// [GET] /checkout/
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({
    _id: cartId,
  });

  if (cart.products.length > 0) {
    for (const item of cart.products) {
      const productId = item.product_id;
      const productInfo = await Product.findOne({
        _id: productId,
      }).select("title thumbnail slug price discountPercentage");

      productInfo.priceNew = productsHelper.priceNewProduct(productInfo);

      item.productInfo = productInfo;

      item.totalPrice = productInfo.priceNew * item.quantity;
    }
  }

  cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0);

  res.render("client/pages/checkout/index", {
    pageTitle: "Đặt Hàng",
    cartDetail: cart,
  });
}

// [POST] /checkout/order
module.exports.order = async (req, res) => {
  const cartId = req.cookies.cartId;
  const userInfo = req.body;

  const cart = await Cart.findOne({ _id: cartId });

  const products = [];

  for (const cartItem of cart.products) {
    const productDoc = await Product.findOne({
      _id: cartItem.product_id,
    }).select("title thumbnail price discountPercentage");

    const productData = {
      product_id: cartItem.product_id,
      price: productDoc.price,
      discountPercentage: productDoc.discountPercentage,
      quantity: cartItem.quantity,
      productInfo: {
        title: productDoc.title,
        thumbnail: productDoc.thumbnail
      }
    };

    products.push(productData);
  }

  const orderInfo = {
    cart_id: cartId,
    userInfo: userInfo,
    products: products
  };

  const order = new Order(orderInfo);
  await order.save();

  // Tính tổng giá đơn hàng
  const totalPrice = products.reduce((sum, item) => {
    const priceNew = productsHelper.priceNewProduct(item);
    return sum + priceNew * item.quantity;
  }, 0);

  // Gửi thông tin đơn hàng qua Email
  const subject = `SHOP FPOLY | Thông Báo Xác Nhận Đơn Hàng Thành Công`;

  const html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #1e88e5;">🛒 Cảm ơn bạn đã đặt hàng tại FPOLY</h2>

      <p>Xin chào <b>${userInfo.fullName}</b>,</p>
      <p>Đơn hàng <b>#${order._id}</b> đã được hệ thống xác nhận. FPOLY sẽ tiến hành xử lý và giao hàng đến bạn sớm nhất có thể (dự kiến 3-5 ngày)</p>

      <h3>Thông Tin Đơn Hàng</h3>
      <ul>
        <li><b>Mã đơn hàng:</b> #${order._id}</li>
        <li><b>Họ tên:</b> ${userInfo.fullName}</li>
        <li><b>SĐT:</b> ${userInfo.phone}</li>
        <li><b>Địa chỉ:</b> ${userInfo.address}</li>
        <li><b>Email:</b> ${userInfo.email}</li>
      </ul>

      <h3>Danh Sách Sản Phẩm</h3>
      <table style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr>
            <th style="border: 1px solid #ccc; padding: 8px;">Tên</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Số lượng</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Giá</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          ${products.map(item => {
    const priceNew = productsHelper.priceNewProduct(item);
    const total = priceNew * item.quantity;
    return `
      <tr>
        <td style="border: 1px solid #ccc; padding: 8px;">${item.productInfo.title}</td>
        <td style="border: 1px solid #ccc; padding: 8px;">${item.quantity}</td>
        <td style="border: 1px solid #ccc; padding: 8px;">${priceNew.toLocaleString()}$</td>
        <td style="border: 1px solid #ccc; padding: 8px;">${total.toLocaleString()}$</td>
      </tr>
    `;
  }).join('')}
        </tbody>
      </table>

      <p style="text-align: right; font-size: 16px; margin-top: 10px;">
        <b>Tổng đơn hàng:</b> ${totalPrice.toLocaleString()}$
      </p>

      <hr/>
      <p>Chúng tôi sẽ cập nhật trạng thái đơn hàng qua email hoặc điện thoại. Mọi thắc mắc vui lòng liên hệ hotline hoặc email hỗ trợ của FPOLY.</p>

      <div style="
        background-color: #fff3cd;
        border: 1px solid #ffeeba;
        padding: 10px;
        border-radius: 4px;
        font-size: 13px;
        color: #856404;
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 20px;
      ">
        <span style="font-size: 16px;">⚠️</span>
        <span><strong>Lưu ý:</strong> Đây là email tự động. Vui lòng không trả lời lại email này.</span>
      </div>

    </div>
  `;

  sendMailHelper.sendMail(userInfo.email, subject, html);

  // Reset lại thông tin giỏ hàng khi đặt hàng xong
  await Cart.updateOne(
    {
      _id: cartId,
    },
    {
      products: []
    });

  res.redirect(`/checkout/success/${order.id}`);
}

// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {

  const order = await Order.findOne({
    _id: req.params.orderId,
  });

  for (const product of order.products) {
    const productInfo = await Product.findOne({
      _id: product.product_id,
    }).select("title thumbnail");

    product.productInfo = productInfo;

    product.priceNew = productsHelper.priceNewProduct(product);

    product.totalPrice = product.priceNew * product.quantity;
  }

  order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice, 0);

  res.render("client/pages/checkout/success", {
    pageTitle: "Đặt Hàng Thành Công",
    order: order,
  });
}