const {
  approveProduct,
  rejectProduct,
  getProducts,
  countProducts
} = require('#service/db/product.service.js');

// [POST] /api/admin/products/:id/approve
module.exports.approve = async (req, res, next) => {
  try {
    await approveProduct(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

// [POST] /api/admin/products/:id/deny
module.exports.deny = async (req, res, next) => {
  try {
    await rejectProduct(req.params.id, req.account._id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

// [GET] /api/products/count
module.exports.count = async (req, res) => {
  const count = await countProducts();
  res.json({ success: true, data: count });
};

// [GET] /api/products/waiting
module.exports.notApproved = async (req, res) => {
  const findOptions = {
    ...(req.query.name && { title: { $regex: req.query.name, $options: 'i' } }),
    approved: false
  };

  const product = await getProducts(findOptions, { lastModifiedAt: 1 }, req.query);
  res.json({ success: true, data: product });
};

// [GET] /api/products/
module.exports.list = async (req, res) => {
  const findOptions = {
    ...(req.query.name && { title: { $regex: req.query.name, $options: 'i' } })
  };

  const product = await getProducts(findOptions, { lastModifiedAt: 1 }, req.query);
  res.json({ success: true, data: product });
};
