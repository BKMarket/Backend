const mongoose = require('../../config/db/customMongoose.js');
const bcrypt = require('bcrypt');
const { fakerJA } = require('@faker-js/faker');

function isHCMUTMail(email) {
  return (
    email.endsWith('@hcmut.edu.vn') && email.indexOf('@') === email.length - '@hcmut.edu.vn'.length
  );
}

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
    avatar: {
      type: String,
      default: fakerJA.image.avatarGitHub()
    },
    role: {
      type: String,
      default: 'User'
    }, //save the permission code
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active'
    },
    cart: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
          },
          quantity: {
            type: Number,
            required: true
          }
        }
      ],
      default: []
    },
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date,
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account'
    }
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

accountSchema.methods.toJSONasync = async function () {
  const account = this.toJSON();
  account.perms =
    (await mongoose.model('Role').findOne({ title: account.role }))?.permissions || [];
  return account;
};

accountSchema.pre('toJSON', async function (next) {
  this.perms = (await mongoose.model('Role').findOne({ title: this.role }))?.permissions || [];
  next();
});

accountSchema.pre('save', async function (next) {
  const account = this;
  if (account.isModified('password')) {
    account.password = await bcrypt.hash(account.password, 10);
  }
  next();
});

accountSchema.statics.login = async function (email, password) {
  const account = await this.findOne({ email, deleted: false, status: 'Active' });
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
