const mongoose = require('#config/db/customMongoose.js');

module.exports.hasValidObjectIdParams = (paramName, req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params[paramName])) {
    return req.params[paramName];
  }
  return res.status(400).json({ success: false, message: paramName + ' must be a valid ObjectID' });
};
