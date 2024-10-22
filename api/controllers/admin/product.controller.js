const Product = require("../../models/product.model.js");
const searchHelper = require("../../../helpers/search.js");
const paginationHelper = require("../../../helpers/pagination.js");
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


    const products = await Product.find(find)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    res.json(products);
}
