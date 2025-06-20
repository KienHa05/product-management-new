const bcrypt = require('bcrypt');

const Account = require("../../models/account.model");

const systemConfig = require("../../config/system");

// [GET] /admin/auth/login
module.exports.login = (req, res) => {
  if (req.cookies.token) {
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
  } else {
    res.render("admin/pages/auth/login", {
      pageTitle: "Đăng Nhập"
    });
  }
}

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await Account.findOne({
    email: email,
    deleted: false
  });

  if (!user) {
    req.flash("error", "Email Không Tồn Tại!");
    res.redirect("back");
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    req.flash("error", "Mật Khẩu Không Chính Xác. Vui Lòng Kiểm Tra Lại!");
    res.redirect("back");
    return;
  }

  if (user.status == "inactive") {
    req.flash("error", "Tài Khoản Này Đang Bị Khóa!");
    res.redirect("back");
    return;
  }

  res.cookie("token", user.token);
  res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
}

// [GET] /admin/auth/logout
module.exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
}