const Blog = require("../../models/blog.model");
const BlogCategory = require("../../models/blog-category.model");
const Account = require("../../models/account.model");

const systemConfig = require("../../config/system");

const filterStatusHelper = require('../../helpers/filterStatus');
const statusPresetConstant = require('../../constants/statusPreset');
const actionPresetConstant = require('../../constants/actionPreset');
const sortPresetConstant = require('../../constants/sortPreset');
const searchHelper = require('../../helpers/search');
const removeDiacriticsHelper = require("../../helpers/normalize");


// [GET] /admin/blogs
module.exports.index = async (req, res) => {
  // Filter Status
  const filterStatus = filterStatusHelper(req.query, statusPresetConstant.blogStatus);

  let find = {
    deleted: false
  };

  if (req.query.status) {
    find.status = req.query.status;
  }
  // End Filter Status

  // Search
  const objectSearch = searchHelper(req.query);

  if (objectSearch.regex) {
    find.slugTitle = objectSearch.regex;
  }
  // End Search

  // Sort
  let sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  // End Sort

  const blogs = await Blog.find(find)
    .sort(sort);

  for (const blog of blogs) {
    // Lấy Ra Thông Tin Người Tạo
    if (blog.createdBy && blog.createdBy.account_id) {
      const userCreated = await Account.findOne({
        _id: blog.createdBy.account_id,
      });

      if (userCreated) {
        blog.createdBy.accountFullName = userCreated.fullName;
      } else {
        blog.createdBy.accountFullName = "Không rõ ai"; // Tránh lỗi undefined
      }
    }

    // Lấy Ra Thông Tin Người Cập Nhật Gần Nhất Trên Giao Diện - Lưu Full Tất Cả Trong DB
    const userUpdatedId = blog.updatedBy.slice(-1)[0];
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

  res.render("admin/pages/blogs/index", {
    pageTitle: "Danh Sách Blog",
    blogs: blogs,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    sortPresetConstant: sortPresetConstant,
    actionPresetConstant: actionPresetConstant
  });
};

// [PATCH] /admin/blogs/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const { status, id } = req.params;

  try {
    const blog = await Blog.findOne({
      _id: id
    });

    if (!blog) {
      req.flash("error", "Không tìm thấy bài viết!");
      return res.redirect(req.get("Referrer") || "/");
    }

    const updateData = {
      status: status
    };

    // Chỉ set publishedAt nếu lần đầu published
    if (status === "published" && !blog.publishedAt) {
      updateData.publishedAt = new Date();
    }

    await Blog.updateOne({ _id: id }, updateData);

    req.flash("success", "Cập Nhật Trạng Thái Thành Công !");
    res.redirect(req.get("Referrer") || "/");
  } catch (err) {
    console.error(err);
    req.flash("error", "Đã xảy ra lỗi khi cập nhật trạng thái!");
    res.redirect(req.get("Referrer") || "/");
  }
};

// [PATCH] /admin/blogs/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date()
  };

  switch (type) {
    case "published":
      await Blog.updateMany(
        { _id: { $in: ids } },
        {
          status: "published"
        }
      );
      req.flash("success", `Cập Nhật Trạng Thái Thành Công ${ids.length} Bài Viết!`);
      break;
    case "draft":
      await Blog.updateMany(
        { _id: { $in: ids } },
        {
          status: "draft"
        }
      );
      req.flash("success", `Cập Nhật Trạng Thái Thành Công ${ids.length} Bài Viết!`);
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);

        await Blog.updateOne(
          { _id: id },
          {
            position: position,
            $push: { updatedBy: updatedBy }
          }
        );
      }
      req.flash("success", `Cập Nhật Vị Trí Thành Công ${ids.length} Bài Viết!`);
      break;
    case "delete-all":
      await Blog.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true
        }
      );
      req.flash("success", `Đã Xóa Thành Công ${ids.length} Bài Viết!`);
      break;
    default:
      break;
  }

  res.redirect("back");
};

// [DELETE] /admin/blogs/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await Blog.updateOne({ _id: id }, {
    deleted: true,
    deletedBy: {
      account_id: res.locals.user.id,
      deletedAt: new Date(),
    }
  });

  req.flash("success", `Đã Xóa Thành Công Bài Viết Này!`);

  res.redirect(req.get("Referrer") || "/");
};

// [GET] /admin/blogs/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false
  };

  const blogCategory = await BlogCategory.find(find);

  res.render("admin/pages/blogs/create", {
    pageTitle: "Thêm Mới Bài Viết",
    blogCategory: blogCategory
  });
};

// [POST] /admin/blogs/create
module.exports.createPost = async (req, res) => {
  // Xử lí Position
  if (req.body.position == "") {
    const countBlogs = await Blog.count();
    req.body.position = countBlogs + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
  // End Xử lí Position

  // Log ai tạo
  req.body.createdBy = {
    account_id: res.locals.user.id
  }
  // End Log ai tạo

  // Xử lí publishedAt
  const { status } = req.body;

  if (req.body.title) {
    req.body.slugTitle = removeDiacriticsHelper(req.body.title.toLowerCase());
  }

  req.body.publishedAt = (status === "published" ? new Date() : null);
  // End Xử lí publishedAt

  const blog = new Blog(req.body);
  await blog.save();

  req.flash("success", "Tạo Mới Bài Viết Thành Công !");

  res.redirect(`${systemConfig.prefixAdmin}/blogs`);
};

// [GET] /admin/blogs/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    };

    const blog = await Blog.findOne(find);

    const blogCategory = await BlogCategory.find({
      deleted: false
    });

    res.render("admin/pages/blogs/edit", {
      pageTitle: "Chỉnh Sửa Bài Viết",
      blog: blog,
      blogCategory: blogCategory
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/blogs`);
  }
};

// [PATCH] /admin/blogs/edit/:id
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

    await Blog.updateOne(
      { _id: id },
      {
        ...req.body,
        $push: { updatedBy: updatedBy }
      }
    );
    req.flash("success", "Cập Nhật Bài Viết Thành Công!");
  } catch (error) {
    req.flash("error", "Cập Nhật Bài Viết Thất Bại!");
  }

  res.redirect(req.get("Referrer") || "/");
};

// [GET] /admin/blogs/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    };

    const blog = await Blog.findOne(find);

    const blogCategoryId = blog.blog_category_id;

    const blogCategory = await BlogCategory.findOne({
      _id: blogCategoryId
    });

    res.render("admin/pages/blogs/detail", {
      pageTitle: blog.title,
      blog: blog,
      blogCategory: blogCategory
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/blogs`);
  }
};