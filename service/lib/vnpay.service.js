const {
  ProductCode,
  VnpLocale,
  InpOrderAlreadyConfirmed: IpnOrderAlreadyConfirmed,
  IpnFailChecksum,
  IpnInvalidAmount,
  IpnOrderNotFound,
  IpnSuccess,
  IpnUnknownError
} = require('vnpay');
const vnpayConfig = require('../../config/vnpay.js');
const moment = require('moment-timezone');
const Order = require('#models/order.model.js');

const paymentExpireDate = () => {
  const PAYMENT_EXPIRE_TIME = 30 * 60 * 1000; // 30 minutes
  const expireDate = new Date();
  expireDate.setTime(expireDate.getTime() + PAYMENT_EXPIRE_TIME);
  return Number(moment(expireDate).tz('Asia/Ho_Chi_Minh').format('YYYYMMDDHHmmss'));
};

module.exports.createPaymentURL = async (
  amount,
  orderInfo,
  transID,
  ipAddr = '127.0.01',
  vnp_ReturnUrl
) => {
  return vnpayConfig.buildPaymentUrl({
    vnp_Amount: amount,
    vnp_IpAddr: ipAddr,
    vnp_TxnRef: transID,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: ProductCode.Pay,
    vnp_ReturnUrl,
    vnp_Locale: VnpLocale.VN,
    vnp_ExpireDate: paymentExpireDate()
  });
};

module.exports.logTransaction = async (order) => {
  return await new Order(order).save();
};

// Verify and return status to VNPAY then log to db
// Check for when user cancels and VNPAY still sends IPN (!)
module.exports.verifyIPN = async (ipn) => {
  try {
    const verify = vnpayConfig.verifyIpnCall(ipn);
    if (!verify.isVerified) {
      return IpnFailChecksum;
    }

    //find order / transaction Log
    const order = await Order.findOne({
      transactionID: verify.vnp_TxnRef
    });

    if (!order) {
      return IpnOrderNotFound;
    }

    if (verify.vnp_Amount !== order.money) {
      return IpnInvalidAmount;
    }

    if (order.completed === true) {
      return IpnOrderAlreadyConfirmed;
    }

    // update the order status
    order.completed = true;
    await order.save();

    return IpnSuccess;
  } catch (err) {
    console.error(err.stack);
    return IpnUnknownError;
  }
};

// Verify and return status to client
module.exports.verifyReturnURL = async () => {};

// Refund is restricted in sandbox mode of VNpay, not yet implemented
