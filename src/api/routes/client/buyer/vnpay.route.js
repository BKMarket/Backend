const express = require('express');
const { verifyIPN } = require('#controllers/client/order.controller.js');
const { checkAuthenticationStrict } = require('#middleware/auth.middleware.js');

const router = express.Router();

router.get('/ipn', verifyIPN);

module.exports = router;
