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

  const blogsCategory = await BlogCategory.find({
    deleted: false,
    status: "active"
  });

  res.render("client/pages/blogs/index", {
    pageTitle: "Tổng Hợp Bài Viết",
    blogs: blogs,
    blogsCategory: blogsCategory,
    currentCategory: ""    // mặc định là “Tất cả”
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

// [GET] /blogs/:slugCategory
module.exports.category = async (req, res) => {
  try {
    const slug = req.params.slugCategory;

    // Lấy danh sách category để dropdown
    const blogsCategory = await BlogCategory.find({
      deleted: false,
      status: "active"
    });

    // Tìm category hiện tại theo slug
    const category = blogsCategory.find(c => c.slug === slug);
    if (!category) return res.redirect("/blogs");

    // Lọc blogs theo category
    const blogs = await Blog.find({
      blog_category_id: category._id,
      deleted: false,
      status: "published"
    }).sort({ position: "desc" });

    console.log(slug);


    res.render("client/pages/blogs/index", {
      pageTitle: category.title,
      blogs: blogs,
      blogsCategory: blogsCategory,
      currentCategory: slug
    });
  } catch (error) {
    console.error(error);
    res.redirect(req.get("Referrer") || "/blogs");
  }
};
