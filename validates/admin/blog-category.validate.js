module.exports.createPost = (req, res, next) => {
  if (!req.body.title) {
    req.flash("error", "Vui Lòng Nhập Tiêu Đề!");
    res.redirect("back");
    return;
  }
  next();
}