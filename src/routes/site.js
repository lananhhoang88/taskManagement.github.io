const express = require('express');
const router = express.Router();

const siteController = require('../app/controllers/SiteController');

router.get('/home', siteController.index)
router.post('/home', siteController.authenticate)
router.get('/login', siteController.login)
router.get('/logout', siteController.logout)

module.exports = router;