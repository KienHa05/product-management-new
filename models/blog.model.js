const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const blogSchema = new mongoose.Schema(
  {
    title: String,
    thumbnail: String,
    blog_category_id: {
      type: String,
      default: ""
    },
    slug: {
      type: String,
      slug: "title",
      unique: true
    },
    summary: String,
    content: String,
    author: String,
    publishedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      default: "draft", // [draft, published]
    },
    position: Number,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedBy: {
      account_id: String,
      deletedAt: Date,
    },
    deletedAt: Date,
    createdBy: {
      account_id: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    updatedBy: [
      {
        account_id: String,
        updatedAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model('Blog', blogSchema, 'blogs');

module.exports = Blog;
