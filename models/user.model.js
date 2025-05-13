const mongoose = require("mongoose");
const generate = require("../helpers/generate");

const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    tokenUser: {
      type: String,
      default: () => generate.generateRandomString(30),
    },
    phone: String,
    avatar: String,
    status: {
      type: String,
      default: "active",
    },
    requestFriends: Array, // Lời Mời Đã Gửi
    acceptFriends: Array, // Lời Mời Đã Nhận
    friendList: [ // Danh Sách Bạn Bè
      {
        user_id: String,
        room_chat_id: String,
      }
    ],
    statusOnline: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true
  }
);
const User = mongoose.model('User', userSchema, "users");

module.exports = User;