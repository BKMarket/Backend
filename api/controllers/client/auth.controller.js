const Account = require('#models/account.model.js');
const { createToken } = require('#service/token.service.js');

module.exports.signUp = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    let account = new Account({ firstName, lastName, email, password });
    account = await account.save();
    const token = await createToken(account);
    // change returned json later
    res.status(201).json({ token, account });
  } catch (err) {
    next(err);
  }
};

module.exports.logIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const account = await Account.login(email, password);
    const token = await createToken(account);
    // change returned json later
    res.status(200).json({ token, account });
  } catch (err) {
    // Handle login error here (thrown from Account model)
    next(err);
  }
};
