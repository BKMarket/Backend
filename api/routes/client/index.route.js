const authRoutes = require('./auth.route.js');
const cartRoutes = require('./cart.route.js');

module.exports = (app) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/carts', cartRoutes);
};
