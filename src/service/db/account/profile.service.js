const Account = require('#models/account.model.js');
const productService = require('#service/db/product.service.js');

const getProfiles = async (findOptions, sortOptions, { page = 1, limit = 10 } = {}) => {
  const records = await Account.find(findOptions).sort(sortOptions).paginate({ page, limit });
  return records;
};

const getProfile = async (accountId) => {
  const profile = await Account.findById(accountId);
  return profile;
};

const updateProfile = async (accountId, profile) => {
  const updatedProfile = await Account.findByIdAndUpdate(accountId, profile, { new: true });
  return updatedProfile;
};

const deleteProfile = async (accountId) => {
  return await updateProfile(accountId, { status: 'Inactive' });
};

const terminateProfile = async (accountId, adminId) => {
  productService.deleteProductsOfUser(accountId, adminId);
  return await updateProfile(accountId, { deleted: true, deletedAt: Date.now() });
};

const activateProfile = async (accountId) => {
  await updateProfile(accountId, { status: 'Active', deleted: false, deletedAt: null });
};

const countProfiles = async () => {
  return await Account.countDocuments();
};

const profileService = {
  getProfiles,
  getProfile,
  updateProfile,
  deleteProfile,
  terminateProfile,
  activateProfile,
  countProfiles
};

module.exports = profileService;
