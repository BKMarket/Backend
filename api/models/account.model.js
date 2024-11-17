const mongoose = require('mongoose');
const isHCMUTMail = require('../../validator/isHCMUTMail.js');
const bcrypt = require('bcrypt');

const accountSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
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
    phone: {
      type: String,
      default: null
    },
    avatar: String,
    role: {
      type: String,
      default: 'User'
    }, //save the permission code
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active'
    },
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        delete ret.password;
        delete ret.createdAt;
        delete ret.updatedAt;
      }
    }
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
  const account = await this.findOne({ email, deleted: false });
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
