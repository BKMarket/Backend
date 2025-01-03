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
const vnpayConfig = require('#config/vnpay.js');
const moment = require('moment-timezone');
const Order = require('#models/order.model.js');
const orderService = require('#service/db/order/order.service.js');

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

    verify.vnp_ResponseCode;

    if (!verify.isVerified) {
      return IpnFailChecksum;
    }

    if (!(verify.vnp_ResponseCode == '00' || verify.vnp_ResponseCode == '07')) {
      return {
        RspCode: verify.vnp_ResponseCode,
        Message: verify.vnp_Message
      };
    }

    //find order / transaction Log
    const order = await orderService.getOrderByOptions({
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
    await orderService.updateOrder(order.id, { completed: true });

    return IpnSuccess;
  } catch (err) {
    console.error(err.stack);
    return IpnUnknownError;
  }
};

// Refund is restricted in sandbox mode of VNpay, not yet implemented
