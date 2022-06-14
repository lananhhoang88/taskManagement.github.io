const express = require('express');
const router = express.Router();

const projectController = require('../app/controllers/ProjectsController');

router.get('/create', projectController.create)
router.post('/store', projectController.store)
router.get('/:id/edit', projectController.edit)
router.put('/:id', projectController.update)
router.patch('/:id/restore', projectController.restore)
router.delete('/:id', projectController.destroy)
router.delete('/:id/force', projectController.forceDestroy)
router.get('/show/:slug', projectController.showProject)
router.get('/list', projectController.show) 
router.post('/list', projectController.show)
router.get('/getAll', projectController.getAll)
router.put('/updateItem/:id', projectController.updateItem)


module.exports = router;
