const express = require('express');
const router = express.Router();

const controller = require("../../controllers/admin/role.controller");

const { requirePermission } = require("../../middlewares/admin/permission.middleware");

router.get('/', requirePermission('roles_view'), controller.index);

router.get('/create', requirePermission('roles_create'), controller.create);

router.post('/create', requirePermission('roles_create'), controller.createPost);

router.get('/edit/:id', requirePermission('roles_edit'), controller.edit);

router.patch('/edit/:id', requirePermission('roles_edit'), controller.editPatch);

router.get('/permissions', requirePermission('roles_permissions'), controller.permissions);

router.patch(
  '/permissions',
  requirePermission('roles_permissions'),
  controller.permissionsPatch
);

router.get('/detail/:id', requirePermission('roles_view'), controller.detail);

router.delete('/delete/:id', requirePermission('roles_delete'), controller.deleteItem);

module.exports = router;