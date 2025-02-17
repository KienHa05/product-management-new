module.exports.registerPost = (req, res, next) => {

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

    if (!req.body.password) {
        req.flash("error", "Vui Lòng Nhập Mật Khẩu!");
        res.redirect("back");
        return;
    }

    next();
}