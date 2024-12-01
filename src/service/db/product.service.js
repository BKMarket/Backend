const Product = require('#models/product.model.js');

const countProducts = async (findOptions) => {
  const count = await Product.countDocuments(findOptions);
  return count;
};

const getProducts = async (findOptions, sortOptions, { page = 1, limit = 10 } = {}) => {
  const products = await Product.find(findOptions)
    .sort(sortOptions)
    .paginate({ page, limit })
    .populate('createdBy', '_id firstName lastName email avatar');
  return products;
};

const getProduct = async (productId) => {
  const product = await Product.findById(productId);
  return product;
};

const createProduct = async (productInfo) => {
  const product = await Product.create(productInfo);
  return product;
};

const updateProduct = async (productId, creatorId, updateData) => {
  const product = await Product.findOneAndUpdate(
    { _id: productId, createdBy: creatorId },
    { approved: false, deleted: false, deletedBy: null, ...updateData, lastModifiedAt: new Date() }
  );
  return product;
};

const deleteProduct = async (productId, creatorId) => {
  const product = await Product.findOneAndUpdate(
    { _id: productId, createdBy: creatorId },
    { deleted: true },
    { new: true }
  );
  return product;
};

const rejectProduct = async (productId) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    { approved: false, lastModifiedAt: new Date() },
    { new: true }
  );
  return product;
};

const approveProduct = async (productId) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    { approved: true, lastModifiedAt: new Date() },
    { new: true }
  );
  return product;
};

const productService = {
  countProducts,
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  rejectProduct,
  approveProduct
};

module.exports = productService;
