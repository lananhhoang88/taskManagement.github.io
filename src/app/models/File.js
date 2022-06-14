const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const Schema = mongoose.Schema;

const File = new Schema({
    id: { type: String },
    name: { type: String },
    path: { type: String }, // Lưu path trong folder /[FolderSaveFile - cấu hình trong util/file.js]
    created: { type: Date }
}, {
    timestamps: true,
});

//Add pluginss
// mongoose.plugin(slug);
File.plugin(mongoose_delete, {
    deletedAt: true,
    overrideMethods: 'all'
})

module.exports = mongoose.model('File', File);