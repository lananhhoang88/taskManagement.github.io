const express = require('express');
const multer  = require('multer');
const upload = multer({ dest: './public/uploads' });
const router = express.Router();

const issueController = require('../app/controllers/IssuesController');


router.get('/create',  issueController.create)
router.post('/store', upload.single('attachment'), issueController.store)
router.get('/:id/edit', issueController.edit)
router.put('/:id', issueController.update)
router.patch('/:id/restore', issueController.restore)
router.delete('/:id', issueController.destroy)
router.delete('/:id/force', issueController.forceDestroy)
router.get('/show/:slug', issueController.showIssue)
router.get('/list', issueController.show) 
router.post('/list', issueController.show) 
router.post('/comment', issueController.comment) 
router.post('/watch/:id', issueController.watch)
router.post('/unwatch/:id', issueController.unwatch)


module.exports = router;
