const express = require('express');
const router = express.Router();

const controller = require("../../controllers/client/order.controller");


router.get('/', controller.index);

router.get('/detail/:orderId', controller.detail);

router.patch('/cancel/:orderId', controller.cancelOrder);

module.exports = router;