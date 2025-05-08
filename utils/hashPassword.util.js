const bcrypt = require('bcrypt');

// Có thể copy nguyên hàm IIFE này vứt sang bên giao diện [GET] Login rồi chạy là OK
// Hoặc đứng từ thư mục gốc chạy lệnh : node hassPassword.util.js
module.exports = (async () => {
  try {
    const plainPassword = 'levana'; // thay bằng mật khẩu tại đây
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    console.log('Hashed password:', hashedPassword);
  } catch (error) {
    console.error('Error hashing password:', error);
  }
})();
