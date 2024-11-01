const { verifyToken } = require('../service/token.service');

const isLogged = (token) => {
  if (!token || !verifyToken(token)) return false;
  return true;
};

const isLoggedIn = (isLoggedIn, message) => (req, res, next) => {
  const token = req.cookies?.['jwt'];
  if (isLogged(token) !== isLoggedIn) {
    return res.status(403).json({ message });
  }
  next();
};

// permissonLists: [String]
const hasPermission = (permissionLists) => (req, res, next) => {
  const token = req.cookies['jwt'];
  const { permissions } = verifyToken(token);
  const hasPerms = permissionLists.every((perm) => permissions?.includes(perm));
  if (!hasPerms) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  next();
};

const hasRole = (role) => (req, res, next) => {
  const token = req.cookies['jwt'];
  const { role_id } = verifyToken(token);
  if (role_id !== role) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  next();
};

module.exports = { isLoggedIn, hasPermission, hasRole };
