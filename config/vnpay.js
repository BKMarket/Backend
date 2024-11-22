const { ignoreLogger, VNPay } = require('vnpay');

const vnpayConfig = new VNPay({
  tmnCode: process.env.VNPAY_TMNCODE,
  secureSecret: process.env.VNPAY_HASHSECRET,
  vnpayHost: 'https://sandbox.vnpayment.vn',
  testMode: true,
  hashAlgorithm: 'SHA512',
  enableLog: true,
  loggerFn: ignoreLogger
});

module.exports = vnpayConfig;
