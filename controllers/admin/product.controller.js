const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");

const systemConfig = require("../../config/system");

const filterStatusHelper = require('../../helpers/filterStatus');
const statusPresetConstant = require('../../constants/statusPreset');
const sortPresetConstant = require('../../constants/sortPreset');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination');

const createTreeHelper = require("../../helpers/createTree");

// [GET] /admin/products
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query, statusPresetConstant.productStatus);
  let objectSearch = searchHelper(req.query);

  let find = {
    deleted: false
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  if (req.query.keyword) {
    find.title = objectSearch.regex;
  }

  // Pagination
  let initPagination = {
    currentPage: 1,
    limitItems: 4
  };

  const countProducts = await Product.count(find);

  let objectPagination = paginationHelper(
    initPagination,
    req.query,
    countProducts
  );
  // End Pagination

  // Sort
  let sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  // End Sort

  const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  for (const product of products) {
    // Lấy Ra Thông Tin Người Tạo
    if (product.createdBy && product.createdBy.account_id) {
      const userCreated = await Account.findOne({
        _id: product.createdBy.account_id,
      });

      if (userCreated) {
        product.createdBy.accountFullName = userCreated.fullName;
      } else {
        product.createdBy.accountFullName = "Không rõ ai"; // Tránh lỗi undefined
      }
    }

    // Lấy Ra Thông Tin Người Cập Nhật Gần Nhất Trên Giao Diện - Lưu Full Tất Cả Trong DB
    const userUpdatedId = product.updatedBy.slice(-1)[0];
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

  res.render("admin/pages/products/index", {
    pageTitle: "Danh Sách Sản Phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
    sortPresetConstant: sortPresetConstant
  });
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date()
  };

  await Product.updateOne(
    { _id: id },
    {
      status: status,
      $push: { updatedBy: updatedBy }
    }
  );

  req.flash("success", "Cập Nhật Trạng Thái Thành Công !");

  res.redirect("back");
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date()
  };

  switch (type) {
    case "active":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          status: "active",
          $push: { updatedBy: updatedBy }
        }
      );
      req.flash("success", `Cập Nhật Trạng Thái Thành Công ${ids.length} Sản Phẩm!`);
      break;
    case "inactive":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          status: "inactive",
          $push: { updatedBy: updatedBy }
        }
      );
      req.flash("success", `Cập Nhật Trạng Thái Thành Công ${ids.length} Sản Phẩm!`);
      break;
    case "delete-all":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date(),
          }
        }
      );
      req.flash("success", `Đã Xóa Thành Công ${ids.length} Sản Phẩm!`);
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);

        await Product.updateOne(
          { _id: id },
          {
            position: position,
            $push: { updatedBy: updatedBy }
          }
        );
      }
      req.flash("success", `Cập Nhật Vị Trí Thành Công ${ids.length} Sản Phẩm!`);
      break;
    default:
      break;
  }

  res.redirect("back");

}

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  // await Product.deleteOne({ _id: id }); // Xóa Vĩnh Viễn
  await Product.updateOne({ _id: id }, {
    deleted: true,
    deletedBy: {
      account_id: res.locals.user.id,
      deletedAt: new Date(),
    }
  });

  req.flash("success", `Đã Xóa Thành Công Sản Phẩm Này!`);

  res.redirect("back");
}

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false
  };

  const category = await ProductCategory.find(find);

  const newCategory = createTreeHelper.tree(category);

  res.render("admin/pages/products/create", {
    pageTitle: "Thêm Mới Sản Phẩm",
    category: newCategory
  });
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if (req.body.position == "") {
    const countProducts = await Product.count();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  req.body.createdBy = {
    account_id: res.locals.user.id
  }

  const product = new Product(req.body);
  await product.save();

  req.flash("success", "Tạo Mới Sản Phẩm Thành Công !");

  res.redirect(`${systemConfig.prefixAdmin}/products`);
}

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {

  try {
    const find = {
      deleted: false,
      _id: req.params.id
    };

    const product = await Product.findOne(find);

    const category = await ProductCategory.find({
      deleted: false
    });

    const newCategory = createTreeHelper.tree(category);

    res.render("admin/pages/products/edit", {
      pageTitle: "Chỉnh Sửa Sản Phẩm",
      product: product,
      category: newCategory
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
}

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);

  try {
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date()
    };

    await Product.updateOne(
      { _id: id },
      {
        ...req.body,
        $push: { updatedBy: updatedBy }
      }
    );
    req.flash("success", "Cập Nhật Sản Phẩm Thành Công!");
  } catch (error) {
    req.flash("error", "Cập Nhật Sản Phẩm Thất Bại!");
  }

  res.redirect(req.get("Referrer") || "/");
}

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    };

    const product = await Product.findOne(find);

    const productCategoryId = product.product_category_id;

    const productCategory = await ProductCategory.findOne({
      _id: productCategoryId
    });

    res.render("admin/pages/products/detail", {
      pageTitle: product.title,
      product: product,
      productCategory: productCategory
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
}
