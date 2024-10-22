const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productsHelper = require("../../../helpers/products")
// [GET] /api/carts/
module.exports.index = async(req, res) => {
    const cartId = '6711b771e8862ed8c1c83ac7';
    
    const cart = await Cart.findOne({
        _id: cartId
    });
    
    res.json(cart);
}


