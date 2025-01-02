const mongoose = require('#config/db/customMongoose.js');

const orderSchema = new mongoose.Schema({
  accountID: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Account',
    required: true
  },
  transactionID: {
    type: String,
    unique: true
  },
  canceled: {
    type: Boolean,
    default: false
  },
  products: {
    type: [
      {
        productID: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true
        },
        stage: {
          type: String,
          enum: ['pending', 'canceled', 'accepted', 'denied', 'finished'],
          default: 'pending'
        },
        proof: {
          type: String
        }
      }
    ]
  },
  money: {
    type: Number,
    required: true
  },
  createDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  paid: {
    type: Boolean,
    index: true
  },
  ipAddr: {
    type: String,
    default: '127.0.0.1'
  }
});

const Order = mongoose.model('Order', orderSchema, 'orders');

module.exports = Order;
