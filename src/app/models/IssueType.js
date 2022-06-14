const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongoose_delete = require('mongoose-delete');
const Schema = mongoose.Schema;

const IssueType = new Schema({
    issueTypeName: { type: String},
    description: { type: String},
    slug: { type: String, slug: 'issueTypeName', unique: true },
  }, {
    timestamps: true,
});


//Add plugins
mongoose.plugin(slug);
IssueType.plugin(mongoose_delete, { 
  deletedAt: true,
  overrideMethods: 'all' 
})

  module.exports = mongoose.model('IssueType', IssueType);