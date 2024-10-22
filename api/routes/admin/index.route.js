const productRoutes = require("./product.route.js");
const accountRoutes = require("./account.route.js");
const roleRoutes = require("./role.route.js");
const productCategoryRoutes = require("./product-category.route.js");
const systemConfig = require("../../../config/system.js");

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;
    app.use(PATH_ADMIN + '/api/products', productRoutes);
    app.use(PATH_ADMIN + '/api/accounts', accountRoutes);
    app.use(PATH_ADMIN + '/api/roles', roleRoutes);
    app.use(PATH_ADMIN + '/api/product-category', productCategoryRoutes); 
}
