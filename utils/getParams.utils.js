const mongoose = require('mongoose');

module.exports.getMongooseObjectIdParams = (paramName, req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params[paramName])) {
    return req.params[paramName];
  }
  return res.status(400).json({ success: false, message: 'Invalid ID' });
};
