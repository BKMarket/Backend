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
    { deleted: true, deletedBy: creatorId },
    { new: true }
  );
  return product;
};

const rejectProduct = async (productId, adminId) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    { approved: false, lastModifiedAt: new Date(), deleted: true, deletedBy: adminId },
    { new: true }
  );
  return product;
};

const approveProduct = async (productId) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    { approved: true, lastModifiedAt: new Date(), deleted: false, deletedBy: null },
    { new: true }
  );
  return product;
};

// const deleteProducts = async (findOptions) => {
//   const products = await Product.deleteMany(findOptions);
//   return products;
// };

const deleteProductsOfUser = async (userId, adminId) => {
  const products = await Product.updateMany(
    { createdBy: userId },
    { deleted: true, deletedBy: adminId, lastModifiedAt: new Date() },
    { new: true }
  );
  return products;
};

const productService = {
  countProducts,
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  rejectProduct,
  approveProduct,
  // deleteProducts,
  deleteProductsOfUser
};

module.exports = productService;
