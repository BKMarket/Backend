const express = require('express');
const authController = require('#controllers/client/auth.controller.js');
const { checkAuthenticationStrict } = require('#middleware/auth.middleware.js');

const router = express.Router();

router.post('/signup', checkAuthenticationStrict(false), authController.signUp);
router.post('/login', checkAuthenticationStrict(false), authController.logIn);

module.exports = router;
