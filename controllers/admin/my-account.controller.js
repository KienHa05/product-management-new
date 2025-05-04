const md5 = require('md5');
const Account = require("../../models/account.model");

// [GET] /admin/my-account/
module.exports.index = async (req, res) => {
  res.render("admin/pages/my-account/index", {
    pageTitle: "Thông Tin Cá Nhân",
  });
}

// [GET] /admin/my-account/edit
module.exports.edit = async (req, res) => {
  res.render("admin/pages/my-account/edit", {
    pageTitle: "Chỉnh Sửa Thông Tin Cá Nhân",
  });
}

// [PATCH] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
  const id = res.locals.user.id;

  const emailExist = await Account.findOne({
    _id: { $ne: id },
    email: req.body.email,
    deleted: false,
  });

  if (emailExist) {
    req.flash('error', `Email ${req.body.email} đã tồn tại. Vui lòng chọn email khác.`);
  } else {
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }

    await Account.updateOne({ _id: id }, req.body);

    req.flash('success', "Cập Nhật Tài Khoản Thành Công !");
  }

  res.redirect(`back`);
}