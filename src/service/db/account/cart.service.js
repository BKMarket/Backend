const Account = require('#models/account.model.js');

const getCart = async (accountId) => {
  const { cart } = await Account.findOne({
    _id: accountId
  }).populate('cart.product');

  return cart;
};

const setQuantityExistingProduct = async (accountQuery, productId, quantity) => {
  const result = await accountQuery?.clone().findOneAndUpdate(
    {
      'cart.product': productId
    },
    quantity == 0
      ? // delete if quantity is 0
        {
          $pull: {
            cart: { product: productId }
          }
        }
      : // else update quantity
        {
          'cart.$.quantity': quantity
        },
    { new: true }
  );

  return result?.cart;
};

const setQuantityNewProduct = async (accountQuery, productId, quantity) => {
  const result = await accountQuery?.clone().findOneAndUpdate(
    {},
    {
      $push: {
        cart: {
          product: productId,
          quantity: quantity
        }
      }
    },
    { new: true }
  );
  return result?.cart;
};

const setQuantity = async (accountId, productId, quantity) => {
  const accountQuery = Account.findById(accountId);

  const cart =
    quantity == 0
      ? await setQuantityExistingProduct(accountQuery, productId, quantity)
      : (await setQuantityExistingProduct(accountQuery, productId, quantity)) ||
        (await setQuantityNewProduct(accountQuery, productId, quantity));

  return cart;
};

const setQuantityBatch = async (accountId, products) => {
  const accountQuery = Account.findById(accountId);
  await Promise.all(
    products.map((product) => {
      return product.quantity == 0
        ? setQuantityExistingProduct(accountQuery, product.productId, product.quantity)
        : setQuantityExistingProduct(accountQuery, product.productId, product.quantity) ||
            setQuantityNewProduct(accountQuery, product.productId, product.quantity);
    })
  );
};

const getSelectedPrice = async (accountId, productIds) => {
  const cart = await getCart(accountId);
  const products = cart
    .filter((product) => productIds.includes(product.product._id.toString()))
    .map((product) => {
      return {
        product: product.product._id,
        quantity: product.quantity,
        price: product.product.price,
        discountPercentage: product.product.discountPercentage
      };
    });
  const total = products.reduce(
    (acc, cur) => acc + ((cur.price * (100 - cur.discountPercentage)) / 100) * cur.quantity,
    0
  );

  return { products, total };
};

const cartService = {
  getCart,
  setQuantity,
  setQuantityBatch,
  getSelectedPrice
};

module.exports = cartService;
