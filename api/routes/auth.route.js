const express = require('express');
const authController = require('../controllers/auth.controller.js');
const { isLoggedIn } = require('../../middleware/auth.middleware.js');

const router = express.Router();

router.post('/signup', isLoggedIn(false, 'Already logged in'), authController.signUp);
router.post('/login', isLoggedIn(false, 'Already logged in'), authController.logIn);
router.get('/logout', authController.logOut);

module.exports = router;
