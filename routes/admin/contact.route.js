const express = require('express');
const router = express.Router();

const controller = require("../../controllers/admin/contact.controller");

const { requirePermission } = require('../../middlewares/admin/permission.middleware');


router.get('/', requirePermission("contacts_view"), controller.index);

module.exports = router;
