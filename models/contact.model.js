const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      trim: true,
      require: true,
    },
    slugSubject: {
      type: String,
      default: ""
    },
    question: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: 'pending'
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model('Contact', contactSchema, 'contacts');

module.exports = Contact;
