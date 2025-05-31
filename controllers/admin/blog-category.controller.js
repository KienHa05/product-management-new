const BlogCategory = require("../../models/blog-category.model");


// [GET] /admin/blogs-category
module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  };

  const records = await BlogCategory.find(find);

  res.render("admin/pages/blogs-category/index", {
    pageTitle: "Danh Mục Bài Viết",
    records: records
  });
};
