const express = require('express');
const multer = require('multer');
const router = express.Router();

const upload = multer();

const controller = require("../../controllers/admin/blog.controller");
const validate = require("../../validates/admin/blog.validate");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

const { requirePermission } = require('../../middlewares/admin/permission.middleware');

router.get('/', requirePermission("blogs_view"), controller.index);

router.patch(
  '/change-status/:status/:id',
  requirePermission("blogs_edit"),
  controller.changeStatus
);

router.patch("/change-multi", requirePermission("blogs_edit"), controller.changeMulti);

router.delete('/delete/:id', requirePermission("blogs_delete"), controller.deleteItem);

router.get('/create', requirePermission("blogs_create"), controller.create);

router.post(
  '/create',
  requirePermission("blogs_create"),
  upload.single('thumbnail'),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
);

router.get("/edit/:id", requirePermission("blogs_edit"), controller.edit);

router.patch(
  "/edit/:id",
  requirePermission("blogs_edit"),
  upload.single('thumbnail'),
  uploadCloud.upload,
  validate.createPost, // Dùng chung validate với create
  controller.editPatch
);

router.get("/detail/:id", requirePermission("blogs_view"), controller.detail);

module.exports = router;
