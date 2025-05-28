const Blog = require("../../models/blog.model");

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

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await Blog.updateOne({ _id: id }, { status: status });

  res.redirect(req.get("Referrer") || "/");
};