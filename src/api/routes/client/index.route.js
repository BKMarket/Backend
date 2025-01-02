const express = require('express');

const authRoutes = require('#routes/client/buyer/auth.route.js');
const profileRoutes = require('#routes/client/buyer/profile.route.js');
const buyerProductRoutes = require('#routes/client/buyer/product.route.js');
const cartRoutes = require('#routes/client/buyer/cart.route.js');
const orderRoutes = require('#routes/client/buyer/order.route.js');
const vnpayRoutes = require('#routes/client/buyer/vnpay.route.js');

const sellerProductRoutes = require('#routes/client/seller/product.route.js');
const sellerOrderRoutes = require('#routes/client/seller/order.route.js');

const { checkAuthenticationStrict } = require('#middleware/auth.middleware.js');

const clientRouter = express.Router();
const sellerRouter = express.Router();

clientRouter.use('/auth', checkAuthenticationStrict(false), authRoutes);
clientRouter.use('/profile', checkAuthenticationStrict(true), profileRoutes);
clientRouter.use('/products', buyerProductRoutes);
clientRouter.use('/carts', checkAuthenticationStrict(true), cartRoutes);
clientRouter.use('/order', checkAuthenticationStrict(true), orderRoutes);
clientRouter.use('/vnpay', vnpayRoutes);

sellerRouter.use('/products', sellerProductRoutes);
sellerRouter.use('/orders', sellerOrderRoutes);

module.exports = (app) => {
  app.use('/api/seller', sellerRouter);
  app.use('/api', clientRouter);
};
