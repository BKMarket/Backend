const express = require('express');
const mongoose = require('#config/db/customMongoose.js');
const dbSeedAccount = require('#service/seeder/account.service.js');
const dbSeedProduct = require('#service/seeder/product.service.js');

const router = express.Router();

router.delete('/clearaccount', async (req, res, next) => {
  mongoose.model('Account').collection.drop();
  res.status(200).json({ status: 'success', message: 'Cleared all accounts' });
});

router.post('/seedaccount', async (req, res, next) => {
  const { total = 100, seed = 123 } = req.body;
  try {
    await dbSeedAccount({ total, seed: Number(seed) });
    res
      .status(200)
      .json({ status: 'success', message: `Seeded ${total} accounts with seed ${seed}` });
  } catch (err) {
    next(err);
  }
});

router.delete('/clearproduct', async (req, res, next) => {
  mongoose.model('Product').collection.drop();
  res.status(200).json({ status: 'success', message: 'Cleared all products' });
});

router.post('/seedproduct', async (req, res, next) => {
  const { total = 100, seed = 123 } = req.body;
  try {
    await dbSeedProduct({ total, seed: Number(seed) });
    res
      .status(200)
      .json({ status: 'success', message: `Seeded ${total} products with seed ${seed}` });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
