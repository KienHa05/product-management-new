const Contact = require("../../models/contact.model");

const sendMailHelper = require("../../helpers/sendMail");

const contactService = require("../../services/client/contact.service");

// [GET] /contact
module.exports.index = async (req, res) => {
  res.render("client/pages/contacts/index", {
    pageTitle: "Liên Hệ Với Chúng Tôi",
  });
};

// [POST] /contact
module.exports.createPost = async (req, res) => {
  try {
    // Lưu thông tin liên hệ vào DB
    const contact = new Contact(req.body);
    await contact.save();

    // Gửi email thông báo tới quản trị viên
    const adminEmail = "kienhgph50150@gmail.com";

    const { subject, html } = contactService(req);

    await sendMailHelper.sendMail(adminEmail, subject, html);

    req.flash("success", "Liên hệ của bạn đã được gửi!");

    res.redirect("/contact/success");
  } catch (error) {
    req.flash("error", `Có Lỗi Gửi Thông Tin Liên Hệ Bên Client: ${error}`);
    res.redirect(`/contact`);
  }
};

// [GET] /contact/success
module.exports.success = async (req, res) => {
  res.render("client/pages/contacts/success", {
    pageTitle: "Liên hệ thành công",
  });
};
