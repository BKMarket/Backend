const Role = require('../../models/role.model');
const { findFields, sortFields, pagination, pickFields } = require('#utils/query.utils.js');
// const { getMongooseObjectIdParams } = require('#utils/getParams.utils.js');

const ROLE_VIEW = { _id: 1, title: 1, description: 1, deleted: 1, deletedAt: 1, permissions: 1 };

//[GET] /admin/api/roles
module.exports.getRoles = async (req, res, next) => {
  const findOptions = findFields(req.query, 'deleted', 'title', 'description', 'permissions');
  const sortOptions = sortFields(req.query, 'deletedAt', 'title');
  const { page, skip, limit } = pagination(req.query);
  try {
    const records = await Role.find(findOptions)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .select(ROLE_VIEW);
    res.status(200).json({ success: true, page: page, data: records });
  } catch (err) {
    next(err);
  }
};

//[GET] /admin/api/roles/:id
module.exports.getRoleById = async (req, res, next) => {
  // const id = getMongooseObjectIdParams('id', req, res);

  try {
    const record = await Role.findById(req.id);
    res.status(200).json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};

//[POST] /admin/api/roles/create
module.exports.createRole = async (req, res, next) => {
  const role = pickFields(req.body, 'title', 'description', 'permissions');
  try {
    const record = await Role.create(role);
    res.status(200).json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};

//[POST] /admin/api/roles/:id/update
module.exports.updateRoleById = async (req, res, next) => {
  // const id = getMongooseObjectIdParams('id', req, res);
  const role = pickFields(req.body, 'delete', 'title', 'description', 'permissions');
  try {
    if (role.delete) {
      const record = await Role.findByIdAndDelete(req.id, { new: true });
      res.status(200).json({ success: true, data: record });
    }
    const record = await Role.findByIdAndUpdate(req.id, role, { new: true });
    res.status(200).json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};
