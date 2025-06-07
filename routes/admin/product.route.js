const express = require('express');
const multer = require('multer');
const router = express.Router();

const upload = multer();

const controller = require("../../controllers/admin/product.controller");
const validate = require("../../validates/admin/product.validate");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

const { requirePermission } = require("../../middlewares/admin/permission.middleware");

router.get("/", requirePermission("products_view"), controller.index);

router.patch(
  "/change-status/:status/:id",
  requirePermission("products_edit"),
  controller.changeStatus
);

router.patch("/change-multi", requirePermission("products_edit"), controller.changeMulti);

router.delete("/delete/:id", requirePermission("products_delete"), controller.deleteItem);

router.get("/create", requirePermission("products_create"), controller.create);

router.post(
  "/create",
  requirePermission("products_create"),
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
);

router.get("/edit/:id", requirePermission("products_edit"), controller.edit);

router.patch(
  "/edit/:id",
  requirePermission("products_edit"),
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.editPatch
);

router.get("/detail/:id", requirePermission("products_view"), controller.detail);


module.exports = router;
