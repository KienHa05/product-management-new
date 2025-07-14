const isObjectId = require("./isObjectId");

/**
 * Hàm xây dựng điều kiện tìm kiếm cho ĐƠN HÀNG (Admin)
 * - Chỉ tìm theo Mã đơn (ObjectId)
 * - Trả về:
 *   {
 *     keyword: "chuỗi người dùng nhập",
 *     find: { _id: keyword } || {}
 *   }
 * Bạn có thể mở rộng thêm nếu cần nhưng hiện tại chỉ tập trung mã đơn để đơn giản.
 */
module.exports = (query) => {
  const keywordRaw = (query.keyword || "").trim(); // loại bỏ khoảng trắng 2 đầu

  // Cho phép người dùng nhập "#<mã đơn>" hoặc chỉ "<mã đơn>"
  const idCandidate = keywordRaw.replace(/^#\s*/, ""); // bỏ ký tự # đầu chuỗi (nếu có) và khoảng trắng ngay sau

  const result = {
    keyword: keywordRaw,
    find: {}
  };

  // Nếu người dùng không nhập gì thì trả về điều kiện rỗng
  if (!keywordRaw) {
    return result;
  }

  // Kiểm tra idCandidate có phải ObjectId hợp lệ hay không (không phân biệt hoa thường)
  if (isObjectId(idCandidate)) {
    result.find = { _id: idCandidate.toLowerCase() };
  }
  // Nếu không phải ObjectId hợp lệ thì vẫn trả về find rỗng => kết quả = tất cả đơn

  return result;
}; 