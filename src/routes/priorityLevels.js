const express = require('express');
const router = express.Router();

const priorityLevelController = require('../app/controllers/PriorityLevelsController');

router.get('/create', priorityLevelController.create)
router.post('/store', priorityLevelController.store)
router.get('/:id/edit', priorityLevelController.edit)
router.put('/:id', priorityLevelController.update)
router.patch('/:id/restore', priorityLevelController.restore)
router.delete('/:id', priorityLevelController.destroy)
router.delete('/:id/force', priorityLevelController.forceDestroy) 
router.get('/list', priorityLevelController.show)
router.post('/list', priorityLevelController.show)

module.exports = router;