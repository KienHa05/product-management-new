const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    title: String,
    roleType: {
      type: String,
      enum: ["admin", "content_manager"],
      default: "content_manager"
    },
    description: String,
    permissions: {
      type: Array,
      default: []
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date
  },
  {
    timestamps: true,
  }
);
const Role = mongoose.model('Role', roleSchema, "roles");

module.exports = Role;