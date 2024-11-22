const mongoose = require('#config/db/customMongoose.js');
module.exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connection to DB succeeded');
  } catch (error) {
    console.log('Connection to DB failed');
    console.error(error);
  }
};
