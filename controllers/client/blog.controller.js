const Blog = require("../../models/blog.model");
const BlogCategory = require("../../models/blog-category.model");

// [GET] /blogs
module.exports.index = async (req, res) => {
  let find = {
    status: "published",
    deleted: false
  };

  let sort = {
    position: "desc"
  };

  const blogs = await Blog.find(find).sort(sort);

  res.render("client/pages/blogs/index", {
    pageTitle: "Tổng Hợp Bài Viết",
    blogs: blogs
  });
};

// [GET] /blogs/:slugBlog
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slugBlog,
      status: "published"
    };

    const blog = await Blog.findOne(find);

    if (blog.blog_category_id) {
      const category = await BlogCategory.findOne({
        _id: blog.blog_category_id,
        status: "active",
        deleted: false,
      });

      blog.category = category;
    }

    res.render("client/pages/blogs/detail", {
      pageTitle: blog.title,
      blog: blog
    });
  } catch (error) {
    console.error(`Có Lỗi Bên Chi Tiết Bài Viết Client: ${error}`);
    res.redirect(`/blogs`);
  }
};