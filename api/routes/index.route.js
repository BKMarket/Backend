const productRoutes = require("./product.route.js");
const accountRoutes = require("./account.route.js");
const roleRoutes = require("./role.route.js");
const cartRoutes = require("./cart.route.js");

module.exports = (app) => {
    app.use('/api/products', productRoutes);
    app.use('/api/accounts', accountRoutes);
    app.use('/api/roles', roleRoutes);
    app.use('/api/carts', cartRoutes);
}
