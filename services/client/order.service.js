const productsHelper = require("../../helpers/products");

module.exports = (products, userInfo, order) => {
  // Tính tổng giá đơn hàng
  const totalPrice = products.reduce((sum, item) => {
    const priceNew = productsHelper.priceNewProduct(item);
    return sum + priceNew * item.quantity;
  }, 0);

  const tableCellStyle = 'border: 1px solid #ccc; padding: 8px; text-align: center;';
  const imageStyle = 'max-width: 100px; height: auto;';
  const productsRowsHtml = products.map((item) => {
    const priceNew = productsHelper.priceNewProduct(item);
    const total = priceNew * item.quantity;

    return `
      <tr>
        <td style="${tableCellStyle}">${item.productInfo.title}</td>
        <td style="${tableCellStyle}">
          <img src="${item.productInfo.thumbnail}" alt="Ảnh sản phẩm" style="${imageStyle}" />
        </td>
        <td style="${tableCellStyle}">${item.quantity}</td>
        <td style="${tableCellStyle}">${priceNew.toLocaleString()}$</td>
        <td style="${tableCellStyle}">${total.toLocaleString()}$</td>
      </tr>
    `;
  }).join('');

  // Gửi thông tin đơn hàng qua Email
  const subject = `SHOP FPOLY | Thông Báo Xác Nhận Đơn Hàng Thành Công`;

  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 16px;">
      <p style="text-align: center; margin-bottom: 24px;">
        <img src="cid:shopLogo" alt="Logo" style="display: block; margin: 0 auto; max-width: 200px; width: 100%; height: auto;" />
      </p>

      <h2 style="color: #1e88e5; margin-bottom: 16px; text-align: center;">🛒 Cảm ơn bạn đã đặt hàng tại FPOLY</h2>

      <p>Xin chào <b>${userInfo.fullName}</b>,</p>
      <p>Đơn hàng <b>#${order._id}</b> đã được hệ thống xác nhận. FPOLY sẽ tiến hành xử lý và giao hàng đến bạn sớm nhất có thể (dự kiến 3-5 ngày).</p>

      <h3>Thông Tin Đơn Hàng</h3>
      <ul style="line-height: 1.6;">
        <li><b>Mã đơn hàng:</b> #${order._id}</li>
        <li><b>Họ tên:</b> ${userInfo.fullName}</li>
        <li><b>SĐT:</b> ${userInfo.phone}</li>
        <li><b>Địa chỉ:</b> ${userInfo.address}</li>
        <li><b>Email:</b> ${userInfo.email}</li>
      </ul>

      <h3>Danh Sách Sản Phẩm</h3>
      <table style="border-collapse: collapse; width: 100%; margin-top: 16px;">
        <thead style="background-color: #f2f2f2;">
          <tr>
            <th style="${tableCellStyle}">Tên</th>
            <th style="${tableCellStyle}">Hình Ảnh</th>
            <th style="${tableCellStyle}">Số lượng</th>
            <th style="${tableCellStyle}">Giá</th>
            <th style="${tableCellStyle}">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          ${productsRowsHtml}
        </tbody>
      </table>

      <p style="text-align: right; font-size: 16px; margin-top: 12px;">
        <b>Tổng đơn hàng:</b> ${totalPrice.toLocaleString()}$
      </p>

      <hr style="margin: 24px 0;" />
      <p>Chúng tôi sẽ cập nhật trạng thái đơn hàng qua email hoặc điện thoại. Mọi thắc mắc vui lòng liên hệ hotline hoặc email hỗ trợ của FPOLY.</p>

      <div style="
        background-color: #fff3cd;
        border: 1px solid #ffeeba;
        padding: 12px;
        border-radius: 4px;
        font-size: 14px;
        color: #856404;
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 24px;
      ">
        <span style="font-size: 18px;">⚠️</span>
        <span><strong>Lưu ý:</strong> Đây là email tự động. Vui lòng không trả lời lại email này.</span>
      </div>
    </div>
  `;

  return {
    subject,
    html,
    attachments: [] // chỉ còn logo
  };
};
