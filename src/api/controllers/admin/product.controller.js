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
    await rejectProduct(req.params.id);
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
  const product = await getProducts({ approved: false }, { lastModifiedAt: 1 }, req.query);
  res.json({ success: true, data: product });
};
