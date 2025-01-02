const authService = require('#service/db/account/auth.service.js');

module.exports.signUp = async (req, res) => {
  try {
    const { token, account } = await authService.signUp(req.body);
    res.status(201).json({ token, account });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};

module.exports.logIn = async (req, res) => {
  try {
    const { token, account } = await authService.logIn(req.body);
    res.status(200).json({ token, account });
  } catch {
    res.status(401).json({ success: false, message: 'Wrong password or email' });
  }
};
