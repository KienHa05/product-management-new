module.exports = (otp) => {
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

  return {
    subject, html
  };
};