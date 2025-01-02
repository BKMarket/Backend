const express = require('express');
const productController = require('#controllers/admin/product.controller.js');

const router = express.Router();

router.get('/waiting', productController.notApproved);
router.post('/:id/approve', productController.approve);
router.post('/:id/deny', productController.deny);
router.get('/count', productController.count);

module.exports = router;
