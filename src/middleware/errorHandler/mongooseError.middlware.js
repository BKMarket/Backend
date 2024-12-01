const mongoose = require('#config/db/customMongoose.js');

// Validation error
module.exports.mongooseValidationError = (err, req, res, next) => {
  if (err instanceof mongoose.Error.ValidationError) {
    let data = {};

    Object.keys(err.errors).forEach((key) => {
      data[key] = err.errors[key].message;
    });

    res.status(400).json({
      success: false,
      status: 400,
      message: 'Validation error',
      data: data
    });
    res.end();
  }

  if (err.message === 'Incorrect email') {
    res.status(401).json({
      success: false,
      status: 401,
      message: 'Incorrect email'
    });
    res.end();
  }

  if (err.message === 'Incorrect password') {
    res.status(401).json({
      success: false,
      status: 401,
      message: 'Incorrect password'
    });
    res.end();
  }

  next(err);
};

// Duplicate key error (unique: true)
module.exports.mongooseDuplicateKeyError = (err, req, res, next) => {
  if (err.code == 11000) {
    let data = {};

    if (err.writeErrors) {
      err.writeErrors.forEach((writeError) => {
        if (writeError?.err?.op?.email) {
          data.email = `Email "${writeError.err.op.email}" already exists in the database`;
        }
      });
    } else {
      Object.keys(err.keyValue).forEach((key) => {
        data[key] = `${key} already existed inside the database`;
      });
    }

    res.status(409).json({
      success: false,
      status: 409,
      message: 'Duplicated key error',
      data: data
    });
    res.end();
  } else {
    next(err);
  }
};
