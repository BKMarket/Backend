const express = require('express');

const router = express.Router();

const controller = require('#controllers/client/product.controller.js');
const { checkAuthenticationStrict } = require('#middleware/auth.middleware.js');

router.post('/create', checkAuthenticationStrict(true), controller.create);

router.get('/my', checkAuthenticationStrict(true), controller.my);

router.get('/banned', checkAuthenticationStrict(true), controller.myBanned);

router.get('/:id/edit', checkAuthenticationStrict(true), controller.detailEdit);

router.post('/:id/update', checkAuthenticationStrict(true), controller.update);

router.delete('/:id/delete', checkAuthenticationStrict(true), controller.delete);

module.exports = router;
