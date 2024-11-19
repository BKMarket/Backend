const express = require('express');
const router = express.Router();

const controller = require('../../controllers/admin/role.controller.js');

router.get('/', controller.getRoles);

router.get('/:id', controller.getRoleById);

router.put('/create', controller.createRole);

router.post('/:id/update', controller.updateRoleById);

module.exports = router;
