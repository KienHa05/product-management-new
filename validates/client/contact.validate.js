module.exports.contact = (req, res, next) => {

  if (!req.body.fullName) {
    req.flash("error", "Vui Lòng Nhập Họ Tên!");
    res.redirect("back");
    return;
  }

  if (!req.body.email) {
    req.flash("error", "Vui Lòng Nhập Email!");
    res.redirect("back");
    return;
  }

  if (!req.body.subject) {
    req.flash("error", "Vui Lòng Nhập Chủ đề");
    res.redirect("back");
    return;
  }

  if (!req.body.question) {
    req.flash("error", "Vui Lòng Nhập Nội Dung Câu Hỏi!");
    res.redirect("back");
    return;
  }

  next();
};