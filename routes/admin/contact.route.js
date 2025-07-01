const express = require('express');
const router = express.Router();

const controller = require("../../controllers/admin/contact.controller");

const { requirePermission } = require('../../middlewares/admin/permission.middleware');


router.get('/', requirePermission("contacts_view"), controller.index);

router.patch(
  '/change-status/:status/:id',
  requirePermission("contacts_edit"),
  controller.changeStatus
);

router.patch("/change-multi", requirePermission("contacts_edit"), controller.changeMulti);

router.delete('/delete/:id', requirePermission("contacts_delete"), controller.deleteItem);

router.get("/detail/:id", requirePermission("contacts_view"), controller.detail);

module.exports = router;
