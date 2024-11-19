const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productsHelper = require("../../../helpers/products")
// [GET] /api/carts/
module.exports.index = async(req, res) => {
    // const cartId = req.cookies.cartId;
    const cartId = '6711b771e8862ed8c1c83acb';

    const cart = await Cart.findOne({
        _id: cartId
    });
    
    if (cart.products.length > 0){
        for (const item of cart.products){
            const productId = item.product_id;
            const productInfo = await Product.findOne({
                _id: productId
                // _id: '671133f6e8862ed8c1d40b11'
            }).select("title thumbnail slug price discountPercent");

            productInfo.priceNew = productsHelper.priceNewProduct(productInfo);
            item.productInfo = productInfo;
            item.totalPrice = productInfo.priceNew * item.quantity;
        }
    }

    cart.totalPrice = cart.products.reduce((total, item) => {
        return total + item.totalPrice;
    }, 0);
    res.json(cart);
}

module.exports.addPost = async(req, res) => {
    const productId = req.params.productId;
    // const productId = '671133f6e8862ed8c1d40b11';
    const quantity = parseInt(req.body.quantity);
    // const cartId = req.cookies.cartId;
    //'6711b771e8862ed8c1c83acb' is cartId
    const cartId = '6711b771e8862ed8c1c83acb';
    
    const cart = await Cart.findOne({
        _id: cartId
    });


    const existProductInCart = cart.products.find(item => item.product_id == productId);
    
    if(existProductInCart){
        const quantityNew = quantity + existProductInCart.quantity;
        await Cart.updateOne({
            _id: cartId,
            "products.product_id": productId 
        }, {
            $set: {
                "products.$.quantity": quantityNew
            }
        });
    } else{
        const objectCart = {
            product_id: productId,
            quantity: quantity
        };
        await Cart.updateOne({ 
            _id: cartId 
        }, {
            $push: { products: objectCart }
        });
    }

    res.send("Add product to cart successfully");
}


module.exports.delete = async(req, res) => {
    // const cartId = req.cookies.cartId;
    const cartId = '6711b771e8862ed8c1c83acb';
    const productId = req.params.productId;
    
    await Cart.updateOne({
        _id: cartId
    }, {
        $pull: { products: { product_id: productId } } //pull is used to delete an object from an array
    });

    res.send("Delete product from cart successfully");
}

module.exports.update = async(req, res) => {
    // const cartId = req.cookies.cartId;
    const cartId = '6711b771e8862ed8c1c83acb';
    const productId = req.params.productId;
    const quantity = req.body.quantity;

    await Cart.updateOne({
        _id: cartId,
        "products.product_id": productId 
    }, {
        $set: {
            "products.$.quantity": quantity,
        }
    });

    res.send("Update product in cart successfully");
}