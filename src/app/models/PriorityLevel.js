const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongoose_delete = require('mongoose-delete');
const Schema = mongoose.Schema;

const PriorityLevel = new Schema({
    priorityLevelName: { type: String},
    description: { type: String},
    slug: { type: String, slug: 'priorityLevelName', unique: true },
  }, {
    timestamps: true,
});

//Add plugins
mongoose.plugin(slug);
PriorityLevel.plugin(mongoose_delete, { 
  deletedAt: true,
  overrideMethods: 'all' 
})

module.exports = mongoose.model('PriorityLevel', PriorityLevel);
