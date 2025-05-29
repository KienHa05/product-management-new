const express = require('express');
const router = express.Router();

const controller = require("../../controllers/admin/blog.controller");

router.get('/', controller.index);

router.patch('/change-status/:status/:id', controller.changeStatus);

router.delete('/delete/:id', controller.deleteItem);

router.get('/create', controller.create);

router.post('/create', controller.createPost);

module.exports = router;
