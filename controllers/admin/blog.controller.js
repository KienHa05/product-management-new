const Blog = require("../../models/blog.model");

const systemConfig = require("../../config/system");

const filterStatusHelper = require('../../helpers/filterStatus');
const statusPresetHelper = require('../../helpers/statusPreset');
const searchHelper = require('../../helpers/search');


// [GET] /admin/blogs
module.exports.index = async (req, res) => {
  // Filter Status
  const filterStatus = filterStatusHelper(req.query, statusPresetHelper.blogStatus);

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
    find.title = objectSearch.regex;
  }
  // End Search

  const blogs = await Blog.find(find);

  res.render("admin/pages/blogs/index", {
    pageTitle: "Danh Sách Blog",
    blogs: blogs,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword
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

// [DELETE] /admin/blogs/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await Blog.updateOne({ _id: id }, {
    deleted: true,
    deletedAt: new Date()
  });

  req.flash("success", `Đã Xóa Thành Công Bài Viết Này!`);

  res.redirect(req.get("Referrer") || "/");
};

// [GET] /admin/blogs/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/blogs/create", {
    pageTitle: "Thêm Mới Bài Viết",
  });
};

// [POST] /admin/blogs/create
module.exports.createPost = async (req, res) => {
  if (req.body.position == "") {
    const countBlogs = await Blog.count();
    req.body.position = countBlogs + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  req.body.createdBy = {
    account_id: res.locals.user.id
  }

  const blog = new Blog(req.body);
  await blog.save();

  req.flash("success", "Tạo Mới Bài Viết Thành Công !");

  res.redirect(`${systemConfig.prefixAdmin}/blogs`);
};