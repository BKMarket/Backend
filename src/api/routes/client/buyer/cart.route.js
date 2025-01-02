const express = require('express');
const router = express.Router();

const cartController = require('#controllers/client/cart.controller.js');

router.get('/', cartController.get);

router.post('/update', cartController.update);

router.post('/delete', cartController.delete);

router.get('/checkout', cartController.checkout);

module.exports = router;
