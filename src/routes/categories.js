const express = require('express');
const router = express.Router();

const categoryController = require('../app/controllers/CategoriesController');

router.get('/create', categoryController.create)
router.post('/store', categoryController.store)
router.get('/:id/edit', categoryController.edit)
router.put('/:id', categoryController.update)
router.patch('/:id/restore', categoryController.restore)
router.delete('/:id', categoryController.destroy)
router.delete('/:id/force', categoryController.forceDestroy) 
router.get('/list', categoryController.show)
router.post('/list', categoryController.show)

module.exports = router;