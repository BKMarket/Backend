const { createPaymentURL, verifyIPN } = require('#service/lib/vnpay.service.js');
const orderService = require('#service/db/order/order.service.js');
const reportService = require('#service/db/order/report.service.js');
const { v4: uuidv4 } = require('uuid');
const Order = require('#models/order.model.js');

module.exports.purchase = async (req, res, next) => {
  const money = req.query.money;
  const products = req.query.products;
  const transID = uuidv4();
  const ipAddr = req.headers['x-forwarded-for'] || '127.0.0.1';
  const vnp_ReturnUrl = req.query.returnUrl;
  try {
    const vnpayURL = await createPaymentURL(
      money,
      `${req.account.name} THANH TOAN ${money}`,
      transID,
      ipAddr,
      vnp_ReturnUrl
    );

    // log transaction to DB
    await orderService.createOrder({
      account: req.account.id,
      transactionID: transID,
      money: money,
      products: products,
      completed: false,
      ipAddr: ipAddr
    });

    return res.status(200).json({
      status: 'Success',
      message: 'Redirect to the following URL to proceed payment',
      url: vnpayURL
    });
  } catch (err) {
    next(err);
  }
};

module.exports.verifyIPN = async (req, res) => {
  const ipnReturn = req.query;
  const resJSON = await verifyIPN(ipnReturn);
  if (resJSON.RspCode == 0) return res.status(200).json(resJSON);
  res.json(resJSON);
};

module.exports.getPaymentHistory = async (req, res) => {
  try {
    const history = await Order.find({ account: req.account.id })
      .populate('account products.product')
      .sort({ createdAt: -1 })
      .paginate({ page: req.query.page, limit: req.query.limit });
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.cancel = async (req, res) => {
  try {
    await orderService.cancelOrder(req.params.orderId);
    res.json({ success: true, message: 'Order canceled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.received = async (req, res) => {
  try {
    await orderService.receiveProduct(req.params.orderId, req.params.productId);
    res.json({ success: true, message: 'Product received' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.deny = async (req, res) => {
  try {
    await orderService.denyProduct(req.params.orderId, req.params.productId);
    res.json({ success: true, message: 'Product denied' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.accept = async (req, res) => {
  try {
    await orderService.acceptProduct(req.params.orderId, req.params.productId);
    res.json({ success: true, message: 'Product accepted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.proof = async (req, res) => {
  try {
    await orderService.updateProductProof(req.params.orderId, req.params.productId, req.body.proof);
    res.json({ success: true, message: 'Proof uploaded' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.report = async (req, res) => {
  try {
    await reportService.createReport(req.account.id, req.params.productId, req.body);
    res.json({ success: true, message: 'Reported' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getMy = async (req, res) => {
  try {
    const orders = await orderService.getSellerOrders(req.account.id, req.query);
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getPending = async (req, res) => {
  try {
    const orders = await orderService.getSellerPendingOrders(req.account.id, req.query);
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getAccepted = async (req, res) => {
  try {
    const orders = await orderService.getSellerAcceptedOrders(req.account.id, req.query);
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getReceived = async (req, res) => {
  try {
    const orders = await orderService.getSellerReceivedOrders(req.account.id, req.query);
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getCanceled = async (req, res) => {
  try {
    const orders = await orderService.getSellerCanceledOrders(req.account.id, req.query);
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
