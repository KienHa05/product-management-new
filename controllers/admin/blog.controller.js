const Blog = require("../../models/blog.model");

// [GET] /admin/blogs
module.exports.index = async (req, res) => {
  const blogs = await Blog.find({
    deleted: false
  });

  res.render("admin/pages/blogs/index", {
    pageTitle: "Danh Sách Blog",
    blogs: blogs
  });
};