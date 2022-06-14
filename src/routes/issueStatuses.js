const express = require('express');
const router = express.Router();

const issueStatusController = require('../app/controllers/issueStatusesController');

router.get('/create', issueStatusController.create)
router.post('/store', issueStatusController.store)
router.get('/:id/edit', issueStatusController.edit)
router.put('/:id', issueStatusController.update)
router.patch('/:id/restore', issueStatusController.restore)
router.delete('/:id', issueStatusController.destroy)
router.delete('/:id/force', issueStatusController.forceDestroy) 
router.get('/list', issueStatusController.show)
router.post('/list', issueStatusController.show)

module.exports = router;