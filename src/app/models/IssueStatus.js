const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongoose_delete = require('mongoose-delete');
const Schema = mongoose.Schema;

const IssueStatus = new Schema({
    issueStatusName: { type: String},
    description: { type: String},
    slug: { type: String, slug: 'issueStatusName', unique: true },
  }, {
    timestamps: true,
});

//Add plugins
mongoose.plugin(slug);
IssueStatus.plugin(mongoose_delete, { 
  deletedAt: true,
  overrideMethods: 'all' 
})

module.exports = mongoose.model('IssueStatus', IssueStatus);
