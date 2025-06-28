module.exports = (req) => {
  const subject = `📬 Liên hệ mới từ ${req.body.fullName}`;

  const html = `
      <div style="background-color: #f0f4f8; padding: 30px 15px;">
        <table align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); font-family: 'Segoe UI', Arial, sans-serif;">
          <tr>
            <td style="padding: 30px 25px;">
              <!-- Tiêu đề -->
              <h2 style="color: #007bff; text-align: center; margin: 0 0 20px;">📩 Bạn có một liên hệ mới!</h2>

              <!-- Nội dung chính -->
              <p style="font-size: 16px; color: #333333; margin-bottom: 10px;">👤 Họ tên: ${req.body.fullName}</p>
              <p style="font-size: 16px; color: #333333; margin-bottom: 10px;">✉️ Email: ${req.body.email}</p>
              ${req.body.phone ? `<p style="font-size: 16px; color: #333333; margin-bottom: 10px;">📞 SĐT: ${req.body.phone}</p>` : ""}
              ${req.body.company ? `<p style="font-size: 16px; color: #333333; margin-bottom: 10px;">🏢 Công ty: ${req.body.company}</p>` : ""}
              ${req.body.subject ? `<p style="font-size: 16px; color: #333333; margin-bottom: 10px;">📝 Chủ đề: ${req.body.subject}</p>` : ""}
              
              <!-- Nội dung câu hỏi -->
              <div style="margin-top: 25px;">
                <p style="font-size: 16px; color: #333333; margin-bottom: 5px;">📄 Nội dung:</p>
                <div style="font-size: 15px; color: #444; white-space: pre-line; line-height: 1.6;">
                  ${req.body.question}
                </div>
              </div>

              <!-- Gạch ngang -->
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;" />

              <!-- Chú thích footer -->
              <p style="font-size: 13px; color: #999999; text-align: center;">📌 Đây là email tự động từ hệ thống website. Vui lòng không trả lời email này.</p>
            </td>
          </tr>
        </table>
      </div>
    `;

  return {
    subject, html
  };
};