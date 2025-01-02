const express = require('express');
const reportController = require('#controllers/admin/report.controller.js');

const router = express.Router();

router.get('/', reportController.getReports());
router.get('/pending', reportController.getReports('pending'));
router.get('/innocent', reportController.getReports('innocent'));
router.get('/guilty', reportController.getReports('guilty'));

router.post('/:id/guilty', reportController.guilty);
router.post('/:id/innocent', reportController.innocent);

module.exports = router;
