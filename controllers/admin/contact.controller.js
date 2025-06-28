const Contact = require("../../models/contact.model");

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


