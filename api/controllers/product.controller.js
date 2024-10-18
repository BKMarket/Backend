const Product = require("../models/product.model");
// const ProductCategory = require("../../models/product-category.model");
// const Account = require("../../models/account.model");
// const systemConfig = require("../../config/system");

// //[GET] /admin/products
// const filterStatusHelper = require("../../helpers/filterStatus.js");
const searchHelper = require("../../helpers/search.js");
const paginationHelper = require("../../helpers/pagination.js");
// const createTreeHelper = require("../../helpers/createTree");
//[GET] /admin/products
module.exports.index = async (req, res) => {
    const find = {
        deleted: false,
    }
    if (req.query.status) {
        find.status = req.query.status;
    }

    let initPagination = {
        currentPage: 1,
        limitItems: 4
    };

    const countProducts = await Product.countDocuments(find);
    const objectPagination = paginationHelper(
        initPagination,
        req.query,
        countProducts
    );

    const objectSearch = searchHelper(req.query);

    // const sort = {};

    // if (req.query.sortKey && req.query.sortValue) {
    //     sort[req.query.sortKey] = req.query.sortValue
    // }

    const products = await Product.find(find)
        // .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    res.json(products);
}
