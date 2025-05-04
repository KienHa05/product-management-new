const Product = require("../../models/product.model");

const productsHelper = require("../../helpers/products");

// [GET] /
module.exports.index = async (req, res) => {
  // Lấy Ra Sản Phẩm Nổi Bật
  const productsFeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active",
  }).limit(6);

  const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured);
  // End Lấy Ra Sản Phẩm Nổi Bật

  // Hiển Thị Danh Sách Sản Phẩm Mới Nhất
  const productsNew = await Product.find({
    deleted: false,
    status: "active",
  }).sort({ position: "desc" }).limit(6);

  const newProductsNew = productsHelper.priceNewProducts(productsNew);
  // End Hiển Thị Danh Sách Sản Phẩm Mới Nhất

  res.render("client/pages/home/index", {
    pageTitle: "Trang Chủ",
    productsFeatured: newProductsFeatured,
    productsNew: newProductsNew,
  });
}