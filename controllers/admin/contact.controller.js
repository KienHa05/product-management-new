const Contact = require("../../models/contact.model");

const systemConfig = require("../../config/system");

const filterStatusHelper = require('../../helpers/filterStatus');
const statusPresetConstant = require('../../constants/statusPreset');
const actionPresetConstant = require('../../constants/actionPreset');
const searchHelper = require('../../helpers/search');

// [GET] /admin/contacts
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query, statusPresetConstant.contactStatus);

  const objectSearch = searchHelper(req.query);

  let find = {
    deleted: false
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  if (objectSearch.regex) {
    find.slugSubject = objectSearch.regex;
  }

  const contacts = await Contact.find(find)


  res.render("admin/pages/contacts/index", {
    pageTitle: "Danh Sách Liên Hệ",
    contacts: contacts,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    actionPresetConstant: actionPresetConstant
  });
};

// [PATCH] /admin/contacts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const { status, id } = req.params;

  try {
    const contact = await Contact.findOne({
      _id: id
    });

    if (!contact) {
      req.flash("error", "Không tìm thấy bài viết!");
      return res.redirect(req.get("Referrer") || "/");
    }

    await Contact.updateOne({ _id: id }, {
      status: status
    });

    req.flash("success", "Cập Nhật Trạng Thái Thành Công !");
    res.redirect(req.get("Referrer") || "/");
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi cập nhật trạng thái!");
    res.redirect(req.get("Referrer") || "/");
  }
};

// [PATCH] /admin/contacts/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");


  switch (type) {
    case "resolved":
      await Contact.updateMany(
        { _id: { $in: ids } },
        {
          status: "resolved"
        }
      );
      req.flash("success", `Cập Nhật Trạng Thái Thành Công ${ids.length} Liên Hệ!`);
      break;
    case "pending":
      await Contact.updateMany(
        { _id: { $in: ids } },
        {
          status: "pending"
        }
      );
      req.flash("success", `Cập Nhật Trạng Thái Thành Công ${ids.length} Liên Hệ!`);
      break;
    case "delete-all":
      await Contact.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true
        }
      );
      req.flash("success", `Đã Xóa Thành Công ${ids.length} Liên Hệ!`);
      break;
    default:
      break;
  }

  res.redirect("back");
};

// [DELETE] /admin/contacts/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  try {
    await Contact.updateOne({ _id: id }, {
      deleted: true
    });

    req.flash("success", `Đã Xóa Thành Công Liên Hệ Này!`);

    res.redirect(req.get("Referrer") || "/");
  } catch (error) {
    req.flash("error", `Lỗi Khi Xóa Liên Hệ : ${error}`);
    console.error(`Có Lỗi Khi Xóa Liên Hệ : ${error}`);
    res.redirect(`${systemConfig.prefixAdmin}/contacts`);
  }
};

// [GET] /admin/contacts/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      _id: req.params.id,
      deleted: false
    };

    const contact = await Contact.findOne(find);

    res.render("admin/pages/contacts/detail", {
      pageTitle: "Chi tiết Liên Hệ",
      contact: contact,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/contacts`);
  }
};


