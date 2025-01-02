const {
  getCart,
  setQuantity,
  setQuantityBatch,
  getSelectedPrice
} = require('#service/db/account/cart.service.js');

// [GET] /api/carts
module.exports.get = async (req, res, next) => {
  try {
    const cart = await getCart(req.account.id);
    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
};

// [POST] /api/carts/update
module.exports.update = async (req, res, next) => {
  const productId = req.body.productId;
  const quantity = req.body.quantity;

  try {
    const cart = await setQuantity(req.account.id, productId, quantity);
    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
};

// [POST] /api/carts/delete
module.exports.delete = async (req, res, next) => {
  const productIds = req.body.productIds;
  try {
    const cart = await setQuantityBatch(
      req.account.id,
      productIds.map((productId) => ({ productId, quantity: 0 }))
    );
    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
};

//[GET] /api/carts/checkout
module.exports.checkout = async (req, res, next) => {
  try {
    const productIds = req.query.productIds;
    if (!productIds) {
      return res.status(400).json({ success: false, message: 'Missing productIds' });
    }

    const { products, total } = await getSelectedPrice(req.account.id, productIds);

    res.status(200).json({
      success: true,
      data: {
        products,
        total
      }
    });
  } catch (err) {
    next(err);
  }
};
