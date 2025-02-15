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

    const newProducts = productsHelper.priceNewProducts(productsFeatured);
    // End Ra Sản Phẩm Nổi Bật

    res.render("client/pages/home/index", {
        pageTitle: "Trang Chủ",
        productsFeatured: newProducts,
    });
}