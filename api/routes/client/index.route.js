const cartRoutes = require("./cart.route.js");

module.exports = (app) => {
    app.use('/api/carts', cartRoutes);
}
