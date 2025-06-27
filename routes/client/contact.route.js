const express = require('express');
const router = express.Router();

const controller = require("../../controllers/client/contact.controller");

const validate = require("../../validates/client/contact.validate");


router.get('/', controller.index);

router.post('/', validate.contact, controller.createPost);

router.get('/success', controller.success);

module.exports = router;