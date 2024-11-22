const mongoose = require('#config/db/customMongoose.js');

const reportSchema = new mongoose.Schema({
  accountID: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Account',
    required: true
  },
  productID: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  orderID: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Order'
  },
  reason: {
    type: String,
    required: true
  },
  createDate: {
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
