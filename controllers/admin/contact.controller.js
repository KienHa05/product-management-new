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


