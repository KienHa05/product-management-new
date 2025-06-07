const bcrypt = require('bcrypt');

const Account = require("../../models/account.model");
const Role = require("../../models/role.model");

const systemConfig = require("../../config/system");

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  };

  const user = res.locals.user;

  if (!user) {
    return res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }

  // Đảm bảo luôn có user.role
  const currentRole = await Role.findOne({
    _id: user.role_id,
    deleted: false,
  });

  // Nếu role không tìm thấy thì gán mặc định
  user.role = currentRole || { title: "Không phân quyền", permissions: [], roleType: "" };

  const records = await Account.find(find).select("-password -token");

  for (const record of records) {
    const role = await Role.findOne({
      _id: record.role_id,
      deleted: false,
    });

    record.role = role || { title: "Không phân quyền", roleType: "" };

    const isSelf = (record.id === user.id);
    const recordIsAdmin = (record.role.roleType === "admin");
    const currentUserIsAdmin = (user.role.roleType === "admin");

    // Chỉ admin mới được thao tác người khác, không phải chính mình, không phải admin
    record.canModify = currentUserIsAdmin && !isSelf && !recordIsAdmin;

    // Người thường chỉ được sửa chính mình, admin thì không được sửa chính mình
    record.canSelfEdit = isSelf && !currentUserIsAdmin;
  }

  res.render("admin/pages/accounts/index", {
    pageTitle: "Danh Sách Tài Khoản",
    records: records,
    viewerRole: user.role,
  });
}

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false
  });

  res.render("admin/pages/accounts/create", {
    pageTitle: "Tạo Mới Tài Khoản",
    roles: roles,
  });
}

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {

  const emailExist = await Account.findOne({
    email: req.body.email,
    deleted: false,
  });

  if (emailExist) {
    req.flash("error", `Email ${req.body.email} Đã Tồn Tại`);
    res.redirect("back");
  } else {
    // Mã hóa mật khẩu sử dụng bcrypt
    req.body.password = await bcrypt.hash(req.body.password, 10);

    const record = new Account(req.body);
    await record.save();

    req.flash("success", `Thêm Mới Tài Khoản Thành Công!`);

    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
}

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  let find = {
    _id: req.params.id,
    deleted: false,
  };

  try {
    const data = await Account.findOne(find);

    const roles = await Role.find({
      deleted: false
    });

    res.render("admin/pages/accounts/edit", {
      pageTitle: "Chỉnh Sửa Tài Khoản",
      data: data,
      roles: roles,
    });
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
  }
}

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  const emailExist = await Account.findOne({
    _id: { $ne: id },
    email: req.body.email,
    deleted: false,
  });

  if (emailExist) {
    req.flash('error', `Email ${req.body.email} đã tồn tại. Vui lòng chọn email khác.`);
  } else {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    } else {
      delete req.body.password;
    }

    await Account.updateOne({ _id: id }, req.body);

    req.flash('success', "Cập Nhật Tài Khoản Thành Công !");
  }

  res.redirect(req.get("Referrer") || "/");
}

// [PATCH] /admin/accounts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await Account.updateOne(
    { _id: id },
    {
      status: status
    }
  );

  req.flash("success", "Cập Nhật Trạng Thái Thành Công !");

  res.redirect("back");
}

// [DELETE] /admin/accounts/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  try {
    await Account.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedAt: new Date()
      }
    );

    req.flash("success", "Đã Xóa Thành Công Tài Khoản Này!");
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã Xảy Ra Lỗi Khi Xóa Tài Khoản!");
  }

  res.redirect("back");
};

// [GET] /admin/accounts/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    };

    const account = await Account.findOne(find).select("-password -token");

    res.render("admin/pages/accounts/detail", {
      pageTitle: account.title,
      account: account,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

