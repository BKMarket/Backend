const { sortFields, pickFields } = require('#utils/query.utils.js');
const productService = require('#service/db/product.service.js');

const findOptionsQuery2MongooseTransform = (query) => {
  const transformedOptions = {};

  // find by title
  if (query.searchTerm) transformedOptions.title = { $regex: query.searchTerm, $options: 'i' };
  // find by tags
  if (query.tags) transformedOptions.tag = { $in: query.tags };
  // find by price range
  if (query.minPrice) {
    transformedOptions.price = transformedOptions.price || {};
    transformedOptions.price.$gte = Number(query.minPrice) * 1000;
  }
  if (query.maxPrice) {
    transformedOptions.price = transformedOptions.price || {};
    transformedOptions.price.$lte = Number(query.maxPrice) * 1000;
  }
  // find by discount boolean
  if (query.discount) transformedOptions.discountPercentage = { $gt: 0 };

  return transformedOptions;
};

// [GET] /api/products
module.exports.search = async (req, res, next) => {
  const sortOptions = sortFields({ ...req.query.sort }, 'lastModifiedAt', 'price', 'sold');
  const findOptions = {
    ...findOptionsQuery2MongooseTransform(req.query),
    deleted: false,
    approved: true
  };
  try {
    const products = await productService.getProducts(findOptions, sortOptions, req.query);
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

// [GET] /api/products/:slug
module.exports.detail = async (req, res) => {
  const findOptions = {
    deleted: false,
    approved: true,
    slug: req.params.slug
  };

  const product = (await productService.getProducts(findOptions))[0];
  res.json({ success: true, data: product });
};

// For Sellers
// [GET] /api/products/my
module.exports.my = async (req, res, next) => {
  const sortOptions = sortFields({ ...req.query.sort }, 'createdAt', 'price', 'sold');
  const findOptions = {
    ...findOptionsQuery2MongooseTransform(req.query),
    createdBy: req.account.id
  };

  try {
    const products = await productService.getProducts(findOptions, sortOptions, req.query);
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

// [GET] /api/products/banned
module.exports.myBanned = async (req, res, next) => {
  const sortOptions = sortFields({ ...req.query.sort }, 'createdAt', 'price', 'sold');
  const findOptions = {
    ...findOptionsQuery2MongooseTransform(req.query),
    deleted: true,
    createdBy: req.account.id,
    deletedBy: { $ne: req.account.id }
  };

  try {
    const products = await productService.getProducts(findOptions, sortOptions, req.query);
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

// [POST] /api/products/create
module.exports.create = async (req, res, next) => {
  const productData = pickFields(
    req.body,
    'title',
    'tag',
    'description',
    'price',
    'discountPercentage',
    'stock',
    'thumbnail',
    'images'
  );

  productData.createdBy = req.account.id;

  try {
    const product = await productService.createProduct(productData);
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// [GET] /api/products/:slug/edit
module.exports.detailEdit = async (req, res, next) => {
  const findOptions = {
    createdBy: req.account.id,
    slug: req.params.id
  };

  try {
    const product = await productService.getProducts(findOptions);
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// [POST] /api/products/:slug/update
module.exports.update = async (req, res, next) => {
  const update = pickFields(
    req.body,
    'title',
    'tag',
    'description',
    'price',
    'discountPercentage',
    'stock',
    'thumbnail',
    'images'
  );

  update.lastModifiedAt = Date.now();

  try {
    const product = await productService.updateProduct(req.params.id, req.account.id, update);

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// [DELETE] /api/products/:slug/delete
module.exports.delete = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.account.id, {
      deleted: true,
      deletedBy: req.account.id
    });
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};
