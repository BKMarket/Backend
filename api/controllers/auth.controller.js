const Account = require('../models/account.model');
const jwt = require('jsonwebtoken');

const createToken = (payload) => {
  const secret = process.env.JWT_SECRET;
  return jwt.sign(payload, secret, { expiresIn: '15m' });
};

module.exports.signUp = async (req, res, next) => {
  const { fullName, email, password, role_id = 'user' } = req.body;
  console.log(req.body);
  try {
    const token = createToken({ fullName, email, role_id });
    let account = new Account({
      fullName,
      email,
      password,
      token
    });
    account = await account.save();
    res.cookie('jwt', token, { httpOnly: true });
    res.status(201).json({ account });
  } catch (err) {
    next(err);
  }
};

module.exports.logIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const account = await Account.login(email, password);
    const { fullName, role_id } = account;
    const token = createToken({ fullName, email, role_id });
    res.cookie('jwt', token, { httpOnly: true });
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
