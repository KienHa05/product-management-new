module.exports.registerPost = (req, res, next) => {

  if (!req.body.fullName) {
    req.flash("error", "Vui Lòng Nhập Họ Tên!");
    res.redirect("back");
    return;
  }

  if (!req.body.email) {
    req.flash("error", "Vui Lòng Nhập Email!");
    res.redirect("back");
    return;
  }

  if (!req.body.password) {
    req.flash("error", "Vui Lòng Nhập Mật Khẩu!");
    res.redirect("back");
    return;
  }

  next();
}

module.exports.loginPost = (req, res, next) => {

  if (!req.body.email) {
    req.flash("error", "Vui Lòng Nhập Email!");
    res.redirect("back");
    return;
  }

  if (!req.body.password) {
    req.flash("error", "Vui Lòng Nhập Mật Khẩu!");
    res.redirect("back");
    return;
  }

  next();
}

module.exports.forgotPasswordPost = (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", "Vui Lòng Nhập Email!");
    res.redirect("back");
    return;
  }

  next();
}

module.exports.resetPasswordPost = (req, res, next) => {
  if (!req.body.password) {
    req.flash("error", "Vui Lòng Nhập Mật Khẩu!");
    res.redirect("back");
    return;
  }

  if (!req.body.confirmPassword) {
    req.flash("error", "Vui Lòng Xác Nhận Lại Mật Khẩu!");
    res.redirect("back");
    return;
  }

  if (req.body.password !== req.body.confirmPassword) {
    req.flash("error", "Mật Khẩu Xác Nhận Không Khớp. Vui Lòng Nhập Lại!");
    res.redirect("back");
    return;
  }

  next();
}