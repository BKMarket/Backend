const Order = require('#models/order.model.js');
const Product = require('#models/product.model.js');
const mongoose = require('#config/db/customMongoose.js');

const getOwnOrders = async (accountId, { page = 1, limit = 10 } = {}) => {
  const orders = await Order.find({ account: accountId })
    .sort({ createdAt: -1 })
    .paginate({ page, limit })
    .populate('account products.product');
  return orders;
};

const countOrders = async (findOptions) => {
  const count = await Order.countDocuments(findOptions);
  return count;
};

const getRevenue = async () => {
  const orders = await Order.find({ completed: true });
  const revenue = orders.reduce((total, order) => {
    return (
      total +
      order.products.reduce((total, product) => {
        return total + product.price;
      }, 0)
    );
  }, 0);
  return revenue;
};

const getSellerOrdersByStage = async (sellerId, stage, { page = 1, limit = 10 } = {}) => {
  const id = new mongoose.Types.ObjectId(sellerId);

  const orders = await Order.aggregate([
    {
      $unwind: '$products'
    },
    { $match: { completed: true } },
    {
      $lookup: {
        from: 'products',
        localField: 'products.product',
        foreignField: '_id',
        as: 'populatedProduct'
      }
    },
    {
      $unwind: '$populatedProduct'
    },
    {
      $lookup: {
        from: 'accounts',
        localField: 'account',
        foreignField: '_id',
        as: 'account'
      }
    },
    {
      $unwind: '$account'
    },
    {
      $match: {
        ...(stage && { 'products.stage': stage }),
        'populatedProduct.createdBy': id
      }
    },
    {
      $project: {
        _id: 1,
        account: 1,
        product: {
          title: '$populatedProduct.title',
          quantity: '$products.quantity',
          price: '$products.price',
          stage: '$products.stage',
          thumbnail: '$populatedProduct.thumbnail',
          slug: '$populatedProduct.slug',
          _id: '$products.product'
        },
        createdAt: 1
      }
    },
    {
      $skip: (page - 1) * limit
    },
    {
      $limit: limit
    }
  ]);

  return orders;
};

const getSellerOrders = async (sellerId, { page = 1, limit = 10 } = {}) => {
  const orders = await getSellerOrdersByStage(sellerId, undefined, { page, limit });
  return orders;
};

const getSellerPendingOrders = async (sellerId, { page = 1, limit = 10 } = {}) => {
  const orders = await getSellerOrdersByStage(sellerId, 'pending', { page, limit });
  return orders;
};

const getSellerAcceptedOrders = async (sellerId, { page = 1, limit = 10 } = {}) => {
  const orders = await getSellerOrdersByStage(sellerId, 'accepted', { page, limit });
  return orders;
};

const getSellerReceivedOrders = async (sellerId, { page = 1, limit = 10 } = {}) => {
  const orders = await getSellerOrdersByStage(sellerId, 'received', { page, limit });
  return orders;
};

const getSellerCanceledOrders = async (sellerId, { page = 1, limit = 10 } = {}) => {
  const orders = await getSellerOrdersByStage(sellerId, 'canceled', { page, limit });
  return orders;
};

const getOrder = async (orderId) => {
  const order = await Order.findById(orderId);
  return order;
};

const getOrderByOptions = async (findOptions) => {
  const order = await Order.findOne(findOptions);
  return order;
};

const createOrder = async (orderData) => {
  const order = await Order.create(orderData);
  return order;
};

const updateOrder = async (orderId, orderData) => {
  const order = await Order.findByIdAndUpdate(orderId, orderData, { new: true });
  return order;
};

const cancelOrder = async (orderId) => {
  const order = await Order.findById(orderId);
  order.products.forEach((product) => {
    product.stage = 'canceled';
    product.log.push({ stage: 'canceled' });
  });
  await order.save();
};

const updateProductStage = async (orderId, productId, stage) => {
  const order = await Order.findById(orderId);
  const product = order.products.find((product) => product.product == productId);
  product.stage = stage;
  product.log.push({ stage });
  await order.save();
};

const denyProduct = async (orderId, productId) => {
  await updateProductStage(orderId, productId, 'denied');
};

const acceptProduct = async (orderId, productId) => {
  await updateProductStage(orderId, productId, 'accepted');
  const product = await Product.findById(productId);
  product.stock -= 1;
  await product.save();
};

const receiveProduct = async (orderId, productId) => {
  await updateProductStage(orderId, productId, 'received');
  const product = await Product.findById(productId);
  product.sold += 1;
  await product.save();
};

const updateProductProof = async (orderId, productId, proof) => {
  const order = await Order.findById(orderId);
  const product = order.products.find((product) => product.product == productId);
  product.proof = proof;
  await order.save();
};

const orderService = {
  getOwnOrders,
  countOrders,
  createOrder,
  getOrder,
  getOrderByOptions,
  updateOrder,
  cancelOrder,
  denyProduct,
  acceptProduct,
  receiveProduct,
  updateProductProof,
  getSellerOrders,
  getSellerPendingOrders,
  getSellerAcceptedOrders,
  getSellerReceivedOrders,
  getSellerCanceledOrders,
  getRevenue
};

module.exports = orderService;
