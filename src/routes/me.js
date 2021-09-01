const express = require('express');
const router = express.Router();

const meController = require('../app/controllers/MeController');

router.get('/stored/courses', meController.storedCourses)
router.get('/trash/courses', meController.trashCourses)
router.get('/manageAccount', meController.edit)
router.get('/manageAccount', meController.update)
router.get('/changePassword', meController.edit)
router.get('/changePassword', meController.update)


module.exports = router;