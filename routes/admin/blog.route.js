const express = require('express');
const multer = require('multer');
const router = express.Router();

const upload = multer();

const controller = require("../../controllers/admin/blog.controller");
const validate = require("../../validates/admin/blog.validate");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");


router.get('/', controller.index);

router.patch('/change-status/:status/:id', controller.changeStatus);

router.delete('/delete/:id', controller.deleteItem);

router.get('/create', controller.create);

router.post(
  '/create',
  upload.single('thumbnail'),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.single('thumbnail'),
  uploadCloud.upload,
  validate.createPost, // Dùng chung bên tạo sản phẩm vì logic giống nhau
  controller.editPatch
);

module.exports = router;
