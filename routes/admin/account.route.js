const express = require('express');
const multer = require('multer');
const router = express.Router();

const upload = multer();

const controller = require("../../controllers/admin/account.controller");
const validate = require("../../validates/admin/account.validate");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

const { requirePermission } = require('../../middlewares/admin/permission.middleware');

router.get('/', requirePermission('accounts_view'), controller.index);

router.get('/create', requirePermission('accounts_create'), controller.create);

router.post(
  '/create',
  requirePermission('accounts_create'),
  upload.single('avatar'),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
);

router.get('/edit/:id', requirePermission('accounts_edit'), controller.edit);

router.patch(
  '/edit/:id',
  requirePermission('accounts_edit'),
  upload.single('avatar'),
  uploadCloud.upload,
  validate.editPatch,
  controller.editPatch
);

router.patch(
  '/change-status/:status/:id',
  requirePermission('accounts_edit'),
  controller.changeStatus
);

router.delete('/delete/:id', requirePermission('accounts_delete'), controller.deleteItem);

router.get('/detail/:id', requirePermission('accounts_view'), controller.detail);

module.exports = router;