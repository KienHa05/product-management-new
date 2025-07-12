const express = require('express');
const router = express.Router();

const controller = require("../../controllers/admin/order.controller");

const { requirePermission } = require('../../middlewares/admin/permission.middleware');


router.get('/', requirePermission("orders_view"), controller.index);

router.get('/detail/:orderId', requirePermission("orders_view"), controller.detail);

module.exports = router;
