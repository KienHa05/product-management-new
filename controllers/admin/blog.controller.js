const Blog = require("../../models/blog.model");

// [GET] /admin/blogs
module.exports.index = async (req, res) => {
  let filterStatus = [
    {
      name: "Tất Cả",
      status: "",
      class: "",
      buttonColor: "primary"
    },
    {
      name: "Công Khai",
      status: "published",
      class: "",
      buttonColor: "success"
    },
    {
      name: "Bản Nháp",
      status: "draft",
      class: "",
      buttonColor: "warning"
    }
  ];

  if (req.query.status) {
    const index = filterStatus.findIndex(item => item.status == req.query.status);
    filterStatus[index].class = "active";
  } else {
    const index = filterStatus.findIndex(item => item.status == "");
    filterStatus[index].class = "active";
  }

  let find = {
    deleted: false
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  const blogs = await Blog.find(find);

  res.render("admin/pages/blogs/index", {
    pageTitle: "Danh Sách Blog",
    blogs: blogs,
    filterStatus: filterStatus
  });
};