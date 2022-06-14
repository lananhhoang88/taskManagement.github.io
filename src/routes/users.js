const express = require('express');
const multer  = require('multer');
const upload = multer({ dest: './public/uploads' });
const router = express.Router();

const userController = require('../app/controllers/UsersController');

router.get('/create', userController.create)
router.post('/store',  upload.single('avatar'), userController.store)
router.get('/:id/edit', userController.edit)
router.put('/:id', userController.update)
router.patch('/:id/restore', userController.restore)
router.delete('/:id', userController.destroy)
router.delete('/:id/force', userController.forceDestroy) 
router.get('/show/:slug', userController.showUser)
router.get('/list', userController.show)
router.post('/list', userController.show)

module.exports = router;