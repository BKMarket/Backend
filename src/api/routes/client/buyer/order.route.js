const express = require('express');
const {
  purchase,
  getPaymentHistory,
  cancel,
  received,
  report
} = require('#controllers/client/order.controller.js');
const { checkAuthenticationStrict } = require('#middleware/auth.middleware.js');

const router = express.Router();

router.get('/purchase', checkAuthenticationStrict(true), purchase);
router.get('/', checkAuthenticationStrict(true), getPaymentHistory);
router.post('/:orderId/cancel', checkAuthenticationStrict(true), cancel);
router.post('/:orderId/received/:productId', checkAuthenticationStrict(true), received);
router.post('/:orderId/report/:productId', checkAuthenticationStrict(true), report);

module.exports = router;
