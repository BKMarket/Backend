const express = require('express');
const multer = require('multer');
const { checkAuthenticationStrict, hasRole } = require('#middleware/auth.middleware.js');
const controller = require('#controllers/admin/account.controller.js');

const router = express.Router();

router.use(checkAuthenticationStrict(true), hasRole('Admin'));

router.get('/', controller.getAccounts);

router.get('/:id', controller.getAccount);

router.post('/:id/suspend', controller.suspendAccount(true));

router.post('/:id/unsuspend', controller.suspendAccount(false));

module.exports = router;
