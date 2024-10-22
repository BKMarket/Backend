const ProductCategory = require('../../models/product-category.model.js');

module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };
  
    const productCategory = await ProductCategory.find(find);
    res.json(productCategory);
}

