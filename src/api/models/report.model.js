const { required } = require('joi');
const mongoose = require('../../config/db/customMongoose.js');

const reportSchema = new mongoose.Schema({
  account: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Account',
    required: true
  },
  product: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  order: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Order',
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  verdict: {
    type: String,
    enum: ['pending', 'guilty', 'innocent'],
    default: 'pending',
    index: true
  }
});

const Report = mongoose.model('Report', reportSchema, 'reports');

module.exports = Report;
