const BlogCategory = require("../../models/blog-category.model");
const Account = require("../../models/account.model");

const systemConfig = require('../../config/system');

const filterStatusHelper = require('../../helpers/filterStatus');
const statusPresetConstant = require('../../constants/statusPreset');
const searchHelper = require('../../helpers/search');
const removeDiacriticsHelper = require("../../helpers/normalize");


// [GET] /admin/blogs-category
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query, statusPresetConstant.productStatus);

  let find = {
    deleted: false
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  const objectSearch = searchHelper(req.query);

  if (objectSearch.regex) {
    find.slugTitle = objectSearch.regex;
  }

  const records = await BlogCategory.find(find);

  for (const record of records) {
    // Lấy ra thông tin người tạo
    if (record.createdBy && record.createdBy.account_id) {
      const userCreated = await Account.findOne({
        _id: record.createdBy.account_id,
      });

      if (userCreated) {
        record.createdBy.accountFullName = userCreated.fullName;
      } else {
        record.createdBy.accountFullName = "Không rõ ai"; // Tránh lỗi undefined
      }
    }

    // Lấy Ra Thông Tin Người Cập Nhật Gần Nhất Trên Giao Diện - Lưu Full Tất Cả Trong DB
    const userUpdatedId = record.updatedBy.slice(-1)[0];
    if (userUpdatedId) {
      const userUpdated = await Account.findOne({
        _id: userUpdatedId.account_id,
      });

      if (userUpdated) {
        userUpdatedId.accountFullName = userUpdated.fullName;
      } else {
        userUpdatedId.accountFullName = "Không rõ ai";
      }
    }
  }

  res.render("admin/pages/blogs-category/index", {
    pageTitle: "Danh Mục Bài Viết",
    records: records,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword
  });
};

// [GET] /admin/blogs-category/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/blogs-category/create", {
    pageTitle: "Thêm Mới Danh Mục Bài Viết",
  });
};

// [POST] /admin/blogs-category/create
module.exports.createPost = async (req, res) => {
  // const permissions = res.locals.role.permissions;

  // if (permissions.includes("blogs-category_create")) {
  //     console.log("Có Quyền");
  // } else {
  //     res.send("403");
  //     return;
  // }

  if (req.body.position == "") {
    const count = await BlogCategory.count();
    req.body.position = count + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  if (req.body.title) {
    req.body.slugTitle = removeDiacriticsHelper(req.body.title.toLowerCase());
  }

  req.body.createdBy = {
    account_id: res.locals.user.id
  }

  const record = new BlogCategory(req.body);
  await record.save();

  req.flash("success", "Thêm Mới Danh Mục Blog Thành Công !");

  res.redirect(`${systemConfig.prefixAdmin}/blogs-category`);
};

// [GET] /admin/blogs-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await BlogCategory.findOne({
      _id: id,
      deleted: false,
    });

    res.render("admin/pages/blogs-category/edit", {
      pageTitle: "Chỉnh Sửa Danh Mục Bài Viết",
      data: data,
    });
  } catch (error) {
    req.redirect(`${systemConfig.prefixAdmin}/blogs-category`);
  }
};

// [PATCH] /admin/blogs-category/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  req.body.position = parseInt(req.body.position);

  if (req.body.title) {
    req.body.slugTitle = removeDiacriticsHelper(req.body.title.toLowerCase());
  }

  try {
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date()
    };

    await BlogCategory.updateOne(
      { _id: id },
      {
        ...req.body,
        $push: { updatedBy: updatedBy }
      }
    );

    req.flash("success", "Cập Nhật Danh Mục Blog Thành Công!");

  } catch (error) {
    req.flash("error", "Cập Nhật Danh Mục Blog Thất Bại!");
  }

  res.redirect(req.get("Referrer") || "/");
};

// [DELETE] /admin/blogs-category/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await BlogCategory.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedBy: {
        account_id: res.locals.user.id,
        deletedAt: new Date()
      },
    }
  );

  req.flash("success", `Đã Xóa Thành Công Danh Mục Này!`);

  res.redirect("back");
};

// [PATCH] /admin/blogs/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  try {
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date()
    };

    await BlogCategory.updateOne(
      { _id: id },
      {
        status: status,
        $push: { updatedBy: updatedBy }
      }
    );

    req.flash("success", "Cập Nhật Trạng Thái Thành Công !");

  } catch (error) {
    req.flash("error", "Cập Nhật Trạng Thái Thất Bại !");
  }
  res.redirect(req.get("Referrer") || "/");
};

// [GET] /admin/blogs-category/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      _id: req.params.id,
      deleted: false
    };

    const blogCategory = await BlogCategory.findOne(find);

    if (!blogCategory) {
      return res.redirect(`${systemConfig.prefixAdmin}/blogs-category`);
    }

    res.render("admin/pages/blogs-category/detail", {
      pageTitle: blogCategory.title,
      blogCategory: blogCategory,
    });

  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/blogs-category`);
  }
};