const express = require('express');
const orderController = require('#controllers/admin/order.controller.js');

const router = express.Router();

router.get('/count', orderController.count);
router.get('/revenue', orderController.revenue);

module.exports = router;
