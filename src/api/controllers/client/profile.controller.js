const profileService = require('#service/db/account/profile.service.js');
const { pickFields } = require('#utils/query.utils.js');

module.exports.updateProfile = async (req, res) => {
  const { id } = req.account;
  const profile = pickFields(req.body, 'lastName', 'firstName', 'phone', 'avatar');
  try {
    const account = await profileService.updateProfile(id, profile);
    res.status(200).json({ message: 'Account updated', account });
  } catch {
    res.status(400).json({ message: 'Account not found' });
  }
};

module.exports.deleteProfile = async (req, res) => {
  const { id } = req.account;
  try {
    await profileService.deleteProfile(id);
    res.status(200).json({ message: 'Account deleted' });
  } catch {
    res.status(400).json({ message: 'Account not found' });
  }
};

module.exports.getProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const account = await profileService.getProfile(id);
    res.status(200).json({ account: await account.toJSONasync() });
  } catch {
    res.status(400).json({ message: 'Account not found' });
  }
};

module.exports.getOwnProfile = async (req, res) => {
  const { id } = req.account;
  try {
    const account = await profileService.getProfile(id);
    res.status(200).json({ account: await account.toJSONasync() });
  } catch {
    res.status(400).json({ message: 'Account not found' });
  }
};
