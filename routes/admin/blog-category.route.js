const express = require('express');
const multer = require('multer');
const router = express.Router();

const upload = multer();

const controller = require("../../controllers/admin/blog-category.controller");
const validate = require('../../validates/admin/product-category.validate');

const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');

const { requirePermission } = require('../../middlewares/admin/permission.middleware');


router.get('/', requirePermission("blogs-category_view"), controller.index);

router.get('/create', requirePermission("blogs-category_create"), controller.create);

router.post(
  '/create',
  requirePermission("blogs-category_create"),
  upload.single('thumbnail'),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
);

router.get('/edit/:id', requirePermission("blogs-category_edit"), controller.edit);

router.patch(
  '/edit/:id',
  requirePermission("blogs-category_edit"),
  upload.single('thumbnail'),
  uploadCloud.upload,
  validate.createPost,
  controller.editPatch
);

router.delete('/delete/:id', requirePermission("blogs-category_delete"), controller.deleteItem);

router.patch(
  '/change-status/:status/:id',
  requirePermission("blogs-category_edit"),
  controller.changeStatus
);

router.patch(
  "/change-multi",
  requirePermission("blogs-category_edit"),
  controller.changeMulti
);

router.get('/detail/:id', requirePermission("blogs-category_view"), controller.detail);

module.exports = router;
