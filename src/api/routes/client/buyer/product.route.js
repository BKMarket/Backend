const express = require('express');

const router = express.Router();

const controller = require('#controllers/client/product.controller.js');

router.get('/', controller.search);

router.get('/:slug', controller.detail);

module.exports = router;
