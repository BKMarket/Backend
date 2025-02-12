const orderService = require('#service/db/order/order.service.js');

module.exports.count = async (req, res, next) => {
  const count = await orderService.countOrders({ completed: true });
  res.json({ success: true, data: count });
};

module.exports.revenue = async (req, res, next) => {
  const revenue = await orderService.getRevenue();
  res.json({ success: true, data: revenue });
};
