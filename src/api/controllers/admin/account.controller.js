const { sortFields, findFields } = require('#utils/query.utils.js');
const {
  getProfiles,
  terminateProfile,
  activateProfile,
  getProfile,
  countProfiles
} = require('#service/db/account/profile.service.js');

//[GET] /admin/api/accounts
module.exports.getAccounts = async (req, res, next) => {
  const findOptions = {
    ...findFields(req.query, 'firstName', 'lastName', 'email', 'phone', 'role', 'status', 'deleted')
  };

  const sortOptions = sortFields(req.query, 'lastName', 'createdAt', 'deletedAt', 'updatedAt');

  try {
    const records = await getProfiles(findOptions, sortOptions, {
      page: req.query.page,
      limit: req.query.limit
    });
    res.status(200).json({
      success: true,
      data: records
    });
  } catch (error) {
    next(error);
  }
};

//[GET] /admin/api/accounts/:id
module.exports.getAccountById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const account = await getProfile(id);
    res.status(200).json({ success: true, data: account });
  } catch (error) {
    next(error);
  }
};

//[POST] /admin/api/accounts/:id/suspend
module.exports.suspendAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    const account = await terminateProfile(id);
    res.status(200).json({ success: true, data: account });
  } catch (error) {
    next(error);
  }
};

//[POST] /admin/api/accounts/:id/unsuspend
module.exports.unsuspendAccount = async (req, res, next) => {
  console.log(123);
  try {
    const { id } = req.params;
    const account = await activateProfile(id);
    res.status(200).json({ success: true, data: account });
  } catch (error) {
    next(error);
  }
};

module.exports.count = async (req, res, next) => {
  try {
    const count = await countProfiles();
    res.status(200).json({ success: true, data: count });
  } catch (error) {
    next(error);
  }
};
