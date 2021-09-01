const express = require('express');
const router = express.Router();

const taskController = require('../app/controllers/TasksController');

router.get('/create', taskController.create)
router.post('/store', taskController.store)
router.post('/taskdetail/store', taskController.storeTaskDetail)
router.post('/search', taskController.search)
router.get('/:id/edit', taskController.edit)
router.get('/taskdetail/:id/edit', taskController.editTaskDetail)
router.put('/:id', taskController.update)
router.put('/taskdetail/:id', taskController.updateTaskDetail)
router.patch('/:id/restore', taskController.restore)
router.delete('/:id', taskController.destroy)
router.delete('/:id/force', taskController.forceDestroy)
router.get('/show/:slug', taskController.showTask)
router.get('/show', taskController.show) 


module.exports = router;
