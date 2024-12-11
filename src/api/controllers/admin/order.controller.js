const express = require('express');
const orderService = require('#service/db/order/order.service.js');

module.exports.count = async (req, res) => {
  const count = await orderService.countOrders();
  res.json({ success: true, data: count });
};

module.exports.revenue = async (req, res) => {
  const revenue = await orderService.getRevenue();
  res.json({ success: true, data: revenue });
};
