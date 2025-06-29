const bcrypt = require('bcrypt');

// Có thể nhúng require nguyên hàm IIFE này vứt sang bên giao diện [GET] Login rồi chạy là OK
// Hoặc đứng từ thư mục gốc chạy lệnh : node hassPassword.util.js

(async () => {
  try {
    const plainPassword = 'myPassword'; // thay cái mật khẩu bạn muốn tại đây
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    console.log(hashedPassword);
  } catch (error) {
    console.error('Error hashing password:', error);
    process.exit(1);
  }
})();
