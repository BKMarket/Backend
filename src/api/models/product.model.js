const mongoose = require('../../config/db/customMongoose.js');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
  {
    approved: {
      type: Boolean,
      default: false,
      index: true
    },
    title: {
      type: String,
      required: true
    },
    tag: {
      type: [
        {
          type: String,
          index: true
        }
      ]
    },
    description: String,
    price: {
      type: Number,
      required: true
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    stock: {
      type: Number,
      default: 0
    },
    sold: {
      type: Number,
      default: 0
    },
    thumbnail: {
      type: String,
      required: true
    },
    images: [String],
    slug: {
      type: String,
      slug: 'title',
      unique: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      index: true,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    lastModifiedAt: {
      type: Date,
      default: Date.now
    },
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date,
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      index: true
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model('Product', productSchema, 'products');

module.exports = Product;
