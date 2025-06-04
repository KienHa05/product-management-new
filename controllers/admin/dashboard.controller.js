const ProductCategory = require("../../models/product-category.model");
const Product = require("../../models/product.model");
const BlogCategory = require("../../models/blog-category.model");
const Blog = require("../../models/blog.model");
const Account = require("../../models/account.model");
const User = require("../../models/user.model");


// [GET] /admin/dashboard
module.exports.dashboard = async (req, res) => {
  const statistic = {
    categoryProduct: {
      total: 0,
      active: 0,
      inactive: 0
    },
    product: {
      total: 0,
      active: 0,
      inactive: 0
    },
    categoryBlog: {
      total: 0,
      active: 0,
      inactive: 0
    },
    blog: {
      total: 0,
      published: 0,
      draft: 0
    },
    account: {
      total: 0,
      active: 0,
      inactive: 0
    },
    user: {
      total: 0,
      active: 0,
      inactive: 0
    },
  };

  // Danh Mục Sản Phẩm
  statistic.categoryProduct.total = await ProductCategory.count({
    deleted: false
  });

  statistic.categoryProduct.active = await ProductCategory.count({
    status: "active",
    deleted: false
  });

  statistic.categoryProduct.inactive = await ProductCategory.count({
    status: "inactive",
    deleted: false
  });
  // End Danh Mục Sản Phẩm

  // Sản Phẩm
  statistic.product.total = await Product.count({
    deleted: false
  });

  statistic.product.active = await Product.count({
    status: "active",
    deleted: false
  });

  statistic.product.inactive = await Product.count({
    status: "inactive",
    deleted: false
  });
  // End Sản Phẩm

  // Danh Mục Blog
  statistic.categoryBlog.total = await BlogCategory.count({
    deleted: false
  });

  statistic.categoryBlog.active = await BlogCategory.count({
    status: "active",
    deleted: false
  });

  statistic.categoryBlog.inactive = await BlogCategory.count({
    status: "inactive",
    deleted: false
  });
  // End Danh Mục Blog

  // Blog
  statistic.blog.total = await Blog.count({
    deleted: false
  });

  statistic.blog.published = await Blog.count({
    status: "published",
    deleted: false
  });

  statistic.blog.draft = await Blog.count({
    status: "draft",
    deleted: false
  });
  // End Blog

  // Tài Khoản Bên Admin
  statistic.account.total = await Account.count({
    deleted: false
  });

  statistic.account.active = await Account.count({
    status: "active",
    deleted: false
  });

  statistic.account.inactive = await Account.count({
    status: "inactive",
    deleted: false
  });
  // End Tài Khoản Bên Admin

  // Tài Khoản Bên Client
  statistic.user.total = await User.count({
    deleted: false
  });

  statistic.user.active = await User.count({
    status: "active",
    deleted: false
  });

  statistic.user.inactive = await User.count({
    status: "inactive",
    deleted: false
  });
  // End Tài Khoản Bên Client

  res.render("admin/pages/dashboard/index", {
    pageTitle: "Trang Tổng Quan",
    statistic: statistic
  });
}