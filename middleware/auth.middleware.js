const { verifyToken } = require('../service/token.service');

// DO NOT USE if route doesn't require authentication
// If isAuthenticated == true, only authorized user can access
// If isAuthenticated == false, only unauthorized user can access

const checkAuthenticationStrict = (isAuthenticated) => (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const payload = verifyToken(token);
  const hasPayload = !!payload;
  if (hasPayload !== isAuthenticated)
    return isAuthenticated
      ? res.status(401).json('Unauthorized')
      : res.status(200).json('Already logged in');
  // Decodes JWT once and saves to req.account
  req.account = payload;
  next();
};

// permissonLists: [String]
const hasPermission = (permissionLists) => (req, res, next) => {
  const { permissions } = req.account;
  const hasPerms = permissionLists.every((perm) => permissions?.includes(perm));
  if (!hasPerms) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  next();
};

const hasRole = (requiredRole) => (req, res, next) => {
  const { role } = req.account;
  if (requiredRole !== role) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  next();
};

module.exports = { checkAuthenticationStrict, hasPermission, hasRole };
