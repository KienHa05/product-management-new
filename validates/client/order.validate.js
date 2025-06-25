module.exports.order = (req, res, next) => {

  if (!req.body.fullName) {
    req.flash("error", "Vui Lòng Nhập Họ Tên!");
    res.redirect("back");
    return;
  }

  if (!req.body.phone) {
    req.flash("error", "Vui Lòng Nhập Số Điện Thoại!");
    res.redirect("back");
    return;
  }

  if (!req.body.address) {
    req.flash("error", "Vui Lòng Nhập Địa Chỉ!");
    res.redirect("back");
    return;
  }

  if (!req.body.email) {
    req.flash("error", "Vui Lòng Nhập Email!");
    res.redirect("back");
    return;
  }

  next();
}