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
    },
    question: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model('Contact', contactSchema, 'contacts');

module.exports = Contact;
