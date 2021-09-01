const express = require('express');
const router = express.Router();

const reportController = require('../app/controllers/ReportsController');

router.get('/report', reportController.index);
router.get('/gantt', reportController.gantt);
router.get('/board', reportController.board);

module.exports = router;