module.exports.index = (req, res) => {
    res.render("admin/pages/products/index", {
        pageTitle: "Danh Sách Sản Phẩm"
    });
}