const fileSystem = require('fs');
const path = require('path');
const { FolderSaveFile } = require('./../../util/file');

class FileController {
    // save file
    upload(req, res, next) {
        res.write(JSON.stringify(req.file));
        res.end();
    }
    //[GET] /categories/show/:slug (show a category)
    download(req, res, next) {
        const arrPath = __dirname.split('\\');
        arrPath.splice(arrPath.length - 3, 3);
        var filePath = path.join(arrPath.join('\\'), FolderSaveFile, req.params.fileName);
        res.download(filePath);
        return;
    }
}


module.exports = new FileController();