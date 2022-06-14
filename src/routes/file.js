const express = require('express');
const router = express.Router();
const multer = require('multer');
const { FolderSaveFile } = require('./../util/file');
var upload = multer({ dest: `${FolderSaveFile}/` });
var type = upload.single('file');

const categoryController = require('../app/controllers/FileController');

router.get('/download/:fileName', categoryController.download)
router.post('/upload', type, categoryController.upload);

module.exports = router;