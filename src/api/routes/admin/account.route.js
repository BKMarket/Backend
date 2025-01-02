const express = require('express');
const controller = require('#controllers/admin/account.controller.js');

const router = express.Router();

router.get('/count', controller.count);

router.post('/:id/suspend', controller.suspendAccount);

router.post('/:id/unsuspend', controller.unsuspendAccount);

router.get('/:id', controller.getAccountById);

router.get('/', controller.getAccounts);

module.exports = router;
