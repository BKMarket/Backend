const express = require('express');
const authController = require('#controllers/client/auth.controller.js');

const router = express.Router();

router.post('/signup', authController.signUp); // works
router.post('/login', authController.logIn); // works

module.exports = router;
