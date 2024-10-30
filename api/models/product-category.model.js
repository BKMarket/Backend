const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const productCategorySchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        thumbnail: String,
        status: String,
        position: Number,
        parent_id: {
            type: String,
            default: ""
        },
        slug: {
            type: String,
            slug: "title",
            unique: true
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date
    }, {
        timestamps: true
    });

const ProductCategory = mongoose.model('Product-Category', productCategorySchema, "product-category");

module.exports = ProductCategory;