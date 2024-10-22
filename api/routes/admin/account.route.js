const express = require('express');
const multer = require("multer");

const router = express.Router();

const controller = require('../../controllers/admin/account.controller.js');

router.get('/', controller.index);

module.exports = router;