const Contact = require("../../models/contact.model");

const systemConfig = require("../../config/system");

// [GET] /admin/contacts
module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  };

  const contacts = await Contact.find(find)


  res.render("admin/pages/contacts/index", {
    pageTitle: "Danh Sách Liên Hệ",
    contacts: contacts
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


