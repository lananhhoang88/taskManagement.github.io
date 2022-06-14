const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongoose_delete = require('mongoose-delete');
const Schema = mongoose.Schema;

const Issue = new Schema({
    id: { type: String },
    project: { type: String },
    subject: { type: String },
    assignee: { type: String },
    priority: { type: String },
    category: { type: String },
    issueType: { type: String },
    description: String,
    status: String,
    startDate: String,
    dueDate: String,
    attachment: String, // Lưu id của bản ghi file [trường id trong model file]
    slug: { type: String, slug: 'subject', unique: true },
    watcher: { type: Array }
}, {
    timestamps: true,
});

//Add plugins
mongoose.plugin(slug);
Issue.plugin(mongoose_delete, {
    deletedAt: true,
    overrideMethods: 'all'
})

module.exports = mongoose.model('Issue', Issue);