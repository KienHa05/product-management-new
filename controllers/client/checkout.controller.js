const path = require("path");
const logoPath = path.join(__dirname, "../../assets/client/images/2017-FPTPolytechic-01.png");

const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");

const productsHelper = require("../../helpers/products");
const sendMailHelper = require("../../helpers/sendMail");

const orderService = require("../../services/client/order.service");


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
  try {
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
      user_id: res.locals.user ? res.locals.user.id : null, // null biểu thị là "guest" mua hàng
      userInfo: userInfo,
      products: products
    };

    const order = new Order(orderInfo);
    await order.save();

    const { subject, html } = orderService(products, userInfo, order);

    await sendMailHelper.sendMail(
      userInfo.email,
      subject,
      html,
      [
        {
          filename: "logo.png",
          path: logoPath, // đường dẫn ảnh
          cid: "shopLogo"  // trùng với src="cid:shopLogo" để nó gắn link sang bên src
        }
      ]
    );

    // Reset lại thông tin giỏ hàng khi đặt hàng xong
    await Cart.updateOne(
      {
        _id: cartId,
      },
      {
        products: []
      });

    res.redirect(`/checkout/success/${order.id}`);
  } catch (error) {
    req.flash("error", `Lỗi đặt hàng : ${error}`);
    res.redirect("/checkout");
  }

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