const express = require('express');
const {
  deleteProfile,
  updateProfile,
  getProfile,
  getOwnProfile
} = require('#controllers/client/profile.controller.js');

const router = express.Router();

router.get('/', getOwnProfile);

router.get('/:id', getProfile);

router.put('/update', updateProfile); //

router.delete('/delete', deleteProfile);

module.exports = router;
