const express = require('express');
const authController = require('../controllers/auth.controller.js');

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.logIn);
router.get('/logout', authController.logOut);

module.exports = router;
