const express = require('express');
const mongoose = require('mongoose');
const dbSeedAccount = require('#seeder/account.seeder.js');

const router = express.Router();

router.delete('/clearaccount', async (req, res) => {
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

module.exports = router;
