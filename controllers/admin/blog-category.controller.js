const BlogCategory = require("../../models/blog-category.model");
const Account = require("../../models/account.model");

const systemConfig = require('../../config/system');

const filterStatusHelper = require('../../helpers/filterStatus');
const statusPresetConstant = require('../../constants/statusPreset');
const searchHelper = require('../../helpers/search');

// [GET] /admin/blogs-category
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query, statusPresetConstant.productStatus);

  let find = {
    deleted: false
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  const objectSearch = searchHelper(req.query);

  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  const records = await BlogCategory.find(find);

  for (const record of records) {
    // Lấy ra thông tin người tạo
    if (record.createdBy && record.createdBy.account_id) {
      const userCreated = await Account.findOne({
        _id: record.createdBy.account_id,
      });

      if (userCreated) {
        record.createdBy.accountFullName = userCreated.fullName;
      } else {
        record.createdBy.accountFullName = "Không rõ ai"; // Tránh lỗi undefined
      }
    }

    // Lấy Ra Thông Tin Người Cập Nhật Gần Nhất Trên Giao Diện - Lưu Full Tất Cả Trong DB
    const userUpdatedId = record.updatedBy.slice(-1)[0];
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

  res.render("admin/pages/blogs-category/index", {
    pageTitle: "Danh Mục Bài Viết",
    records: records,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword
  });
};


