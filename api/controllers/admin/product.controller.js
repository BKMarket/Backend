const Product = require('../../models/product.model.js');
const ProductCategory = require('../../models/product-category.model.js');

const searchHelper = require('../../../helpers/search.js');
const paginationHelper = require('../../../helpers/pagination.js');
const filterStatusHelper = require('../../../helpers/filter-status.js');
const createTreeHelper = require('../../../helpers/createTree.js');

module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);

  const find = {
    deleted: false
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  const objectSearch = searchHelper(req.query);

  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  let initPagination = {
    currentPage: 1,
    limitItems: 4
  };

  //Pagination
  const countProducts = await Product.countDocuments(find);

  const objectPagination = paginationHelper(initPagination, req.query, countProducts);
  //End Pagination

  //Sort
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = 'desc';
  }
  //End Sort

  const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  res.json(products);
};

module.exports.detail = async (req, res) => {
  const find = {
    deleted: false,
    _id: req.params.id
  };

  const product = await Product.findOne(find);

  // const p_category = await ProductCategory.findOne({
  //     _id: product.product_category_id
  // });

  // if (p_category){
  //     product.product_category_id = p_category.title
  // }
  product.product_category_id = 'Test';
  res.json(product);
  // res.send("Detail");
};

module.exports.create = async (req, res) => {
  let find = {
    deleted: false
  };
  const category = await ProductCategory.find(find);
  // const newCategory = await createTreeHelper.tree(category);
  res.json(category);
};

//Copy this snippet to the body in Postman to test the createPost function:

// {
//     "createdBy": {
//       "createdAt": "2024-11-02T08:45:13.818Z"
//     },
//     "product_category_id": "Test",
//     "_id": "671133f6e8862ed8c1d40b0e",
//     "title": "Foundation Stick",
//     "description": "A creamy foundation stick for easy application and flawless coverage.",
//     "price": 24.99,
//     "stock": 20,
//     "thumbnail": "https://cdn.dummyjson.com/products/images/beauty/Foundation%20Stick/thu…",
//     "status": "active",
//     "position": 6,
//     "deleted": false,
//     "discountPercentage": 12.5,
//     "deletedAt": null,
//     "updatedBy": [

//     ]
//   }

module.exports.createPost = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if (req.body.position == '') {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  const product = new Product(req.body);
  await product.save();
  res.json(product);
};

module.exports.edit = async (req, res) => {
  const find = {
    deleted: false,
    _id: req.params.id
  };
  const product = await Product.findOne(find);
  //const category = await ProductCategory.find({deleted: false});
  //const newCategory = await createTreeHelper.tree(category);
  res.json({ product });
};

//http://localhost:3000/admin/api/products/edit/:id
// params: {
//     id: "671133f6e8862ed8c1d40b0e"
// }
// body: {
//     "title": "Sample Product1",
//   "product_category_id": "",
//   "description": "This is a sample copy product description.",
//   "price": "1001",
//   "discountPercentage": "101",
//   "stock": "501",
//   "thumbnail": "https://example.com/image.jpg",
//   "status": "active",
//   "featured": "no",
//   "position": "122", // Leave empty to let the server auto-assign the next position
//   "slug": "sample-product",
//   "createdBy": {
//     "account_id": ""
//   },
//   "deleted": false,
//   "deletedBy": {
//     "account_id": "",
//     "deletedAt": null
//   },
//   "updatedBy": [
//     {
//       "account_id": "",
//       "updateAt": "2023-01-01T00:00:00Z"
//     }
//   ]
// }

module.exports.editPatch = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);

  await Product.updateOne(
    { _id: req.params.id },
    {
      ...req.body
    }
  );
  res.send({ message: 'Update success' });
};

module.exports.delete = async (req, res) => {
  const id = req.params.id;
  await Product.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedBy: {
        account_id: '',
        deletedAt: new Date()
      }
    }
  );
  res.json({ message: 'Delete success' });
};
