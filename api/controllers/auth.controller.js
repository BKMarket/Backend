const Account = require('../models/account.model');
const { createToken } = require('../../service/token.service.js');

module.exports.signUp = async (req, res, next) => {
  const { fullName, email, password } = req.body;
  try {
    let account = new Account({ fullName, email, password });
    account = await account.save();
    const token = await createToken(account);
    res.cookie('jwt', token, { httpOnly: true });
    // change returned json later
    res.status(201).json({ account });
  } catch (err) {
    next(err);
  }
};

module.exports.logIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const account = await Account.login(email, password);
    const token = await createToken(account);
    res.cookie('jwt', token, { httpOnly: true });
    // change returned json later
    res.status(200).json({ account });
  } catch (err) {
    // Handle login error here (thrown from Account model)
    next(err);
  }
};

module.exports.logOut = async (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ success: 'true', message: 'Logged out' });
};
