const express = require('express');
const multer = require('multer');
const router = express.Router();

const upload = multer();

const controller = require("../../controllers/admin/product-category.controller");
const validate = require('../../validates/admin/product-category.validate');

const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');

const { requirePermission } = require('../../middlewares/admin/permission.middleware');


router.get('/', requirePermission("products-category_view"), controller.index);

router.get('/create', requirePermission("products-category_create"), controller.create);

router.post(
  '/create',
  requirePermission("products-category_create"),
  upload.single('thumbnail'),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
);

router.get('/edit/:id', requirePermission("products-category_edit"), controller.edit);

router.patch(
  '/edit/:id',
  requirePermission("products-category_edit"),
  upload.single('thumbnail'),
  uploadCloud.upload,
  validate.createPost,
  controller.editPatch
);

router.delete(
  '/delete/:id',
  requirePermission("products-category_delete"),
  controller.deleteItem
);

router.get('/detail/:id', requirePermission("products-category_view"), controller.detail);

router.patch(
  '/change-status/:status/:id',
  requirePermission("products-category_edit"),
  controller.changeStatus
);

module.exports = router;
