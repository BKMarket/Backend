const Account = require('#models/account.model.js');
const { sortFields, findFields, pagination } = require('#utils/query.utils.js');
const { getMongooseObjectIdParams } = require('#utils/getParams.utils.js');

//[GET] /admin/api/accounts
module.exports.getAccounts = async (req, res, next) => {
  const findOptions = {
    deleted: false,
    ...findFields(req.query, 'firstName', 'lastName', 'email', 'phone', 'role', 'status', 'deleted')
  };

  const { page, skip, limit } = pagination(req.query);

  const sortOptions = sortFields(req.query, 'lastName', 'createdAt');

  try {
    const records = await Account.find(findOptions).sort(sortOptions).skip(skip).limit(limit);
    res.status(200).json({
      success: true,
      page: page,
      limit: limit,
      data: records
    });
  } catch (error) {
    next(error);
  }
};

//[GET] /admin/api/accounts/:id
module.exports.getAccountById = async (req, res, next) => {
  try {
    const id = getMongooseObjectIdParams('id', req, res);
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return res.status(400).json({ success: false, message: 'Invalid account ID' });
    // }
    const account = await Account.findById(id);
    res.status(200).json({ success: true, data: account });
  } catch (error) {
    next(error);
  }
};

//[POST] /admin/api/accounts/:id/suspend
//[POST] /admin/api/accounts/:id/unsuspend
module.exports.suspendAccount = (suspend) => async (req, res, next) => {
  try {
    const id = getMongooseObjectIdParams('id', req, res);
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return res.status(400).json({ success: false, message: 'Invalid account ID' });
    // }
    const account = suspend
      ? await Account.findByIdAndUpdate(id, { deleted: true, deletedAt: Date.now() })
      : await Account.findByIdAndUpdate(id, { deleted: false, deletedAt: null });
    res.status(200).json({ success: true, data: account });
  } catch (error) {
    next(error);
  }
};
