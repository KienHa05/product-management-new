const Blog = require("../../models/blog.model");

// [GET] /blogs
module.exports.index = async (req, res) => {
  const blogs = await Blog.find({
    status: "published",
    deleted: false
  });

  res.render("client/pages/blogs/index", {
    pageTitle: "Tổng Hợp Bài Viết",
    blogs: blogs
  });
};