const accountRoutes = require('#routes/admin/account.route.js');
const roleRoutes = require('#routes/admin/role.route.js');
const productRoutes = require('#routes/admin/product.route.js');
const reportRoutes = require('#routes/admin/report.route.js');
const orderRoutes = require('#routes/admin/order.route.js');
const { checkAuthenticationStrict, hasRole } = require('#middleware/auth.middleware.js');
const express = require('express');

const adminRouter = express.Router();

adminRouter.use(checkAuthenticationStrict(true), hasRole('Admin'));
adminRouter.use('/accounts', accountRoutes);
adminRouter.use('/roles', roleRoutes);
adminRouter.use('/reports', reportRoutes);
adminRouter.use('/products', productRoutes);
adminRouter.use('/orders', orderRoutes);

module.exports = (app) => {
  app.use('/api/admin', adminRouter);
};
