const express = require('express');
const router = express.Router();

const issueTypeController = require('../app/controllers/IssueTypesController');

router.get('/create', issueTypeController.create)
router.post('/store', issueTypeController.store)
router.get('/:id/edit', issueTypeController.edit)
router.put('/:id', issueTypeController.update)
router.patch('/:id/restore', issueTypeController.restore)
router.delete('/:id', issueTypeController.destroy)
router.delete('/:id/force', issueTypeController.forceDestroy) 
router.get('/list', issueTypeController.show)
router.post('/list', issueTypeController.show)

module.exports = router;