const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");

const systemConfig = require('../../config/system');

const filterStatusHelper = require('../../helpers/filterStatus');
const statusPresetConstant = require('../../constants/statusPreset');
const searchHelper = require('../../helpers/search');
const removeDiacriticsHelper = require("../../helpers/normalize");
const createTreeHelper = require("../../helpers/createTree");

// [GET] /admin/products-category
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

  const records = await ProductCategory.find(find);

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

  let recordsTree = [];
  let flatRecords = [];

  if (!req.query.status && !objectSearch.keyword) {
    //  Khi không lọc và không tìm kiếm => dạng cây
    recordsTree = createTreeHelper.tree(records);
  } else {
    // Khi có lọc hoặc tìm kiếm => dạng phẳng
    flatRecords = records;
  }

  res.render("admin/pages/products-category/index", {
    pageTitle: "Danh Mục Sản Phẩm",
    recordsTree: recordsTree,
    flatRecords: flatRecords,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword
  });
};

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await ProductCategory.find(find);

  const newRecords = createTreeHelper.tree(records);

  res.render("admin/pages/products-category/create", {
    pageTitle: "Tạo Mới Danh Mục Sản Phẩm",
    records: newRecords,
  });
};

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {

  if (req.body.position == "") {
    const count = await ProductCategory.count();
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

  const record = new ProductCategory(req.body);
  await record.save();

  req.flash("success", "Thêm Mới Danh Mục Sản Phẩm Thành Công !");

  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await ProductCategory.findOne({
      _id: id,
      deleted: false,
    });

    const records = await ProductCategory.find({
      deleted: false,
    });

    const newRecords = createTreeHelper.tree(records);

    res.render("admin/pages/products-category/edit", {
      pageTitle: "Chỉnh Sửa Danh Mục Sản Phẩm",
      data: data,
      records: newRecords,
    });
  } catch (error) {
    req.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};

// [PATCH] /admin/products-category/edit/:id
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

    await ProductCategory.updateOne(
      { _id: id },
      {
        ...req.body,
        $push: { updatedBy: updatedBy }
      }
    );

    req.flash("success", "Cập Nhật Danh Mục Thành Công!");

  } catch (error) {
    req.flash("error", "Cập Nhật Danh Mục Sản Phẩm Thất Bại!");
  }

  res.redirect(req.get("Referrer") || "/");
};

// [DELETE] /admin/products-category/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await ProductCategory.updateOne(
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

  res.redirect(req.get("Referrer") || "/");
};

// [GET] /admin/products-category/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      _id: req.params.id,
      deleted: false
    };

    const productCategory = await ProductCategory.findOne(find);

    if (!productCategory) {
      return res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }

    let parentRecord = null;
    if (productCategory.parent_id) {
      parentRecord = await ProductCategory.findOne({
        _id: productCategory.parent_id,
        deleted: false
      });
    }

    res.render("admin/pages/products-category/detail", {
      pageTitle: productCategory.title,
      productCategory: productCategory,
      parentRecord: parentRecord
    });

  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  try {
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date()
    };

    await ProductCategory.updateOne(
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