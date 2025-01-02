const mongoose = require('../../config/db/customMongoose.js');

const orderSchema = new mongoose.Schema(
  {
    account: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Account',
      required: true
    },
    transactionID: {
      type: String,
      unique: true
    },
    products: {
      type: [
        {
          product: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Product',
            required: true
          },
          quantity: {
            type: Number,
            required: true
          },
          price: { type: Number, required: true },
          stage: {
            type: String,
            enum: ['pending', 'canceled', 'accepted', 'denied', 'received'],
            // pending (first stage, after user put order)
            default: 'pending',
            index: true
          },
          log: {
            type: [
              {
                stage: {
                  type: String,
                  enum: ['pending', 'canceled', 'accepted', 'denied', 'received'],
                  required: true
                },
                time: {
                  type: Date,
                  default: Date.now
                }
              }
            ],
            default: [
              {
                stage: 'pending',
                time: Date.now()
              }
            ]
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
    ipAddr: {
      type: String,
      default: '127.0.0.1'
    },
    completed: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema, 'orders');

module.exports = Order;
