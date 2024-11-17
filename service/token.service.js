const jwt = require('jsonwebtoken');
const Role = require('../api/models/role.model.js');

module.exports.createToken = async (account) => {
  const secret = process.env.JWT_SECRET;
  const { id, email, role, firstName, lastName } = account;
  const { permissions } = (await Role.findOne({ title: role })) || { permissions: [] };
  return jwt.sign({ id, email, role, firstName, lastName, permissions }, secret);
};

module.exports.verifyToken = (token) => {
  let payload;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return (payload = false);
    }
    payload = decoded;
  });
  return payload;
};
