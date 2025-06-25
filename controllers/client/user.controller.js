const bcrypt = require("bcrypt");
const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const Cart = require("../../models/cart.model");

const generateHelper = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sendMail");

// [GET] /user/register
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Đăng Ký Tài Khoản"
  });
}

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  // Check email
  const existEmail = await User.findOne({
    email: req.body.email
  });

  if (existEmail) {
    req.flash("error", "Email Đã Tồn Tại!");
    res.redirect("back");
    return;
  }
  // End Check email

  // Check phone
  const existPhone = await User.findOne({
    phone: req.body.phone
  });

  if (existPhone) {
    req.flash("error", "Số Điện Thoại Đã Tồn Tại!");
    res.redirect("back");
    return;
  }
  // End Check phone

  req.body.password = await bcrypt.hash(req.body.password, 10);

  const user = new User(req.body);
  await user.save();

  res.cookie("tokenUser", user.tokenUser);

  res.redirect("/");

}

// [GET] /user/login
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login", {
    pageTitle: "Đăng Nhập Tài Khoản"
  });
}

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({
    email: email,
    deleted: false
  });

  if (!user) {
    req.flash("error", "Email Không Tồn Tại!");
    res.redirect("back");
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    req.flash("error", "Mật Khẩu Không Chính Xác!");
    res.redirect("back");
    return;
  }

  if (user.status === "inactive") {
    req.flash("error", "Tài Khoản Đang Bị Khóa!");
    res.redirect("back");
    return;
  }

  const cart = await Cart.findOne({
    user_id: user.id
  });

  if (cart) {
    res.cookie("cartId", cart.id);
  } else {
    await Cart.updateOne(
      {
        _id: req.cookies.cartId
      },
      {
        user_id: user.id
      },
    );
  }

  res.cookie("tokenUser", user.tokenUser);

  await User.updateOne({
    tokenUser: user.tokenUser
  }, {
    statusOnline: "online"
  });

  _io.once('connection', (socket) => {
    socket.broadcast.emit("SERVER_RETURN_USER_STATUS_ONLINE", {
      userId: user.id,
      status: "online"
    });
  });

  res.redirect("/");
};

// [GET] /user/logout
module.exports.logout = async (req, res) => {

  await User.updateOne({
    tokenUser: req.cookies.tokenUser
  }, {
    statusOnline: "offline"
  });

  _io.once("connection", (socket) => {
    socket.broadcast.emit("SERVER_RETURN_USER_STATUS_ONLINE", {
      userId: res.locals.user.id,
      status: "offline"
    });
  });

  res.clearCookie("tokenUser");
  res.clearCookie("cartId");
  res.redirect("/");
}

// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgot-password", {
    pageTitle: "Lấy Lại Mật Khẩu"
  });
};

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({
    email: email,
    deleted: false
  });

  if (!user) {
    req.flash("error", "Email Không Tồn Tại!");
    res.redirect("back");
    return;
  }

  // Lưu Thông Tin Vào DB
  const otp = generateHelper.generateRandomNumber(8);

  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now()
  };

  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();

  // Nếu tồn tại email thì gửi mã OTP qua email
  const subject = "FPOLY | Mã OTP Xác Minh Khôi Phục Mật Khẩu - Hiệu Lực 3 Phút";

  const html = `
    <div style="
      max-width: 600px;
      margin: auto;
      padding: 24px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f9f9f9;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      color: #333;
    ">
      <h2 style="color: #1976d2; text-align: center;">🔐 Xác Minh Khôi Phục Mật Khẩu</h2>

      <p>Xin chào,</p>

      <p>Bạn (hoặc ai đó) vừa yêu cầu đặt lại mật khẩu cho tài khoản tại <strong>FPOLY</strong>. Vui lòng sử dụng mã OTP bên dưới để xác minh yêu cầu:</p>

      <div style="
        font-size: 28px;
        font-weight: bold;
        letter-spacing: 4px;
        margin: 20px auto;
        padding: 12px 24px;
        background-color: #e3f2fd;
        border: 1px dashed #1976d2;
        border-radius: 6px;
        color: #0d47a1;
        width: fit-content;
        display: block;
      ">
        ${otp}
      </div>

      <p style="font-size: 14px; color: #555;">
        ⏰ Mã OTP này có hiệu lực trong <strong>3 phút</strong> kể từ thời điểm gửi.
      </p>

      <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email. Tài khoản của bạn sẽ không bị thay đổi.</p>

      <hr style="margin: 30px 0;" />

      <p style="font-size: 12px; color: #999; text-align: center;">
        Đây là email tự động từ hệ thống FPOLY. Vui lòng không phản hồi email này.
      </p>
    </div>
  `;

  sendMailHelper.sendMail(email, subject, html);


  res.redirect(`/user/password/otp?email=${email}`);
};

// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;

  res.render("client/pages/user/otp-password", {
    pageTitle: "Nhập Mã OTP",
    email: email
  });
};

// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });

  if (!result) {
    req.flash("error", "Mã OTP Không Chính Xác!");
    res.redirect("back");
    return;
  }

  const user = await User.findOne({
    email: email,
  });

  res.cookie("tokenUser", user.tokenUser);

  res.redirect("/user/password/reset");
};

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user/reset-password", {
    pageTitle: "Đổi Mật Khẩu"
  });
};

// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
  const password = req.body.password;
  const tokenUser = req.cookies.tokenUser;

  await User.updateOne(
    { tokenUser: tokenUser },
    { password: await bcrypt.hash(password, 10) }
  );

  res.redirect("/");
};

// [GET] /user/info
module.exports.info = async (req, res) => {
  res.render("client/pages/user/info", {
    pageTitle: "Thông Tin Tài Khoản",
  });
};