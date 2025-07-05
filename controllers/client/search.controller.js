const Product = require("../../models/product.model");

const productsHelper = require("../../helpers/products");
const searchHelper = require("../../helpers/search");

// [GET] /search
module.exports.index = async (req, res) => {
  // Nếu không có từ khoá hoặc chỉ toàn khoảng trắng thì quay về trang chủ
  const rawKeyword = (req.query.keyword || "").trim();
  if (!rawKeyword) {
    const referer = req.get("Referrer");
    // Nếu referer tồn tại và không phải chính trang search, chuyển về referer; ngược lại về trang chủ.
    if (referer && !referer.includes("/search")) {
      return res.redirect(referer);
    }
    return res.redirect("/");
  }

  const objectSearch = searchHelper({ keyword: rawKeyword });

  let newProducts = [];

  if (objectSearch.regex) {
    const products = await Product.find({
      slugTitle: objectSearch.regex,
      deleted: false,
      status: "active",
    });

    newProducts = productsHelper.priceNewProducts(products);
  }

  res.render("client/pages/search/index", {
    pageTitle: "Kết Quả Tìm Kiếm",
    keyword: objectSearch.keyword.trim(),
    products: newProducts
  });
}