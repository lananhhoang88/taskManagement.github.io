const express = require('express');
const newsController = require('../app/controllers/NewsController');
const router = express.Router();

const newController = require('../app/controllers/NewsController');

router.get('/:slug', newsController.show)
router.get('/', newsController.index);

module.exports = router;