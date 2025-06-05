const Role = require("../../models/role.model");

const systemConfig = require("../../config/system");

const permissionMap = require("../../constants/permissionMap");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  };

  const records = await Role.find(find);
  res.render("admin/pages/roles/index", {
    pageTitle: "Nhóm Quyền",
    records: records,
  });
}

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {

  res.render("admin/pages/roles/create", {
    pageTitle: "Tạo Nhóm Quyền",
  });
}

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {

  const record = await Role(req.body);
  await record.save();

  res.redirect(`${systemConfig.prefixAdmin}/roles`);
}

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    let find = {
      _id: id,
      deleted: false
    };

    const data = await Role.findOne(find);

    res.render("admin/pages/roles/edit", {
      pageTitle: "Cập Nhật Nhóm Quyền",
      data: data
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    await Role.updateOne({ _id: id }, req.body);

    req.flash("success", "Cập Nhật Nhóm Quyền Thành Công!");
  } catch (error) {
    req.flash("error", "Cập Nhật Nhóm Quyền Thất Bại!");
  }

  res.redirect(req.get("Referrer") || "/");
};

// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
  let find = {
    deleted: false
  };

  const records = await Role.find(find);

  res.render("admin/pages/roles/permissions", {
    pageTitle: "Phân Quyền",
    records: records,
  });
};

// [PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
  const permissions = JSON.parse(req.body.permissions);


  for (const item of permissions) {
    await Role.updateOne({ _id: item.id }, { permissions: item.permissions });
  }

  req.flash("success", "Cập Nhật Phân Quyền Thành Công!");
  res.redirect("back");
};

// [GET] /admin/roles/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    };

    const role = await Role.findOne(find);

    res.render("admin/pages/roles/detail", {
      pageTitle: role.title,
      role: role,
      permissionMap: permissionMap
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

// [DELETE] /admin/roles/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  try {
    await Role.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedAt: new Date()
      }
    );

    req.flash("success", "Đã Xóa Thành Công Vai Trò Này!");
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã Xảy Ra Lỗi Khi Xóa Vai Trò!");
  }

  res.redirect("back");
};