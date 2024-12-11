const express = require('express');
const {
  accept,
  deny,
  proof,
  getMy,
  getPending,
  getAccepted,
  getCanceled
} = require('#controllers/client/order.controller.js');
const { checkAuthenticationStrict } = require('#middleware/auth.middleware.js');

const router = express.Router();

router.get('/my', checkAuthenticationStrict(true), getMy);
router.get('/pending', checkAuthenticationStrict(true), getPending);
router.get('/accepted', checkAuthenticationStrict(true), getAccepted);
router.get('/canceled', checkAuthenticationStrict(true), getCanceled);

router.post('/:orderId/accept/:productId', checkAuthenticationStrict(true), accept);
router.post('/:orderId/deny/:productId', checkAuthenticationStrict(true), deny);
router.post('/:orderId/proof/:productId', checkAuthenticationStrict(true), proof);

module.exports = router;
