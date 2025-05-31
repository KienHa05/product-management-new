const express = require('express');
const router = express.Router();

const controller = require("../../controllers/admin/blog-category.controller");

router.get('/', controller.index);

module.exports = router;
