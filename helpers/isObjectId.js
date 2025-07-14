/**
 * Kiểm tra chuỗi có phải MongoDB ObjectId hợp lệ (24 ký tự hex)?
 * @param {string} str
 * @returns {boolean}
 */
module.exports = function isObjectId(str = "") {
  return /^[0-9a-fA-F]{24}$/.test(str.trim());
}; 