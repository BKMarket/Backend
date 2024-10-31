const mongoose = require('mongoose');
const isHCMUTMail = require('../../validator/isHCMUTMail.js');
const bcrypt = require('bcrypt');

const accountSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: [isHCMUTMail, 'Email must be a valid HCMUT email.']
    },
    password: {
      type: String,
      required: true
    },
    phone: String,
    avatar: String,
    role_id: {
      type: String,
      default: 'User'
    }, //save the permission code
    status: String,
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date
  },
  {
    timestamps: true
  }
);

accountSchema.pre('save', async function (next) {
  const account = this;
  if (account.isModified('password')) {
    account.password = await bcrypt.hash(account.password, 10);
  }
  next();
});

accountSchema.statics.login = async function (email, password) {
  const account = await this.findOne({ email });
  if (account) {
    const isMatch = await bcrypt.compare(password, account.password);
    if (isMatch) {
      return account;
    }
    throw Error('Incorrect password');
  }
  throw Error('Incorrect email');
};

const Account = mongoose.model('Account', accountSchema, 'accounts');

module.exports = Account;
