const Account = require('#models/account.model.js');
const { createToken } = require('#service/lib/token.service.js');

const signUp = async (data) => {
  const { firstName, lastName, email, password } = data;
  let account = new Account({ firstName, lastName, email, password });
  account = await account.save();
  const token = await createToken(account);
  return { token, account: await account.toJSONasync() };
};

const logIn = async (data) => {
  const { email, password } = data;
  const account = await Account.login(email, password);
  const token = await createToken(account);
  return { token, account: await account.toJSONasync() };
};

const authService = {
  signUp,
  logIn
};

module.exports = authService;
