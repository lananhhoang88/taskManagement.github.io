const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongoose_delete = require('mongoose-delete');
const Schema = mongoose.Schema;

const Task = new Schema({
    taskId: { type: String},
    taskName: { type: String, required: true},
    leaderId: { type: String},
    descriptionTask: String,
    progress: String,
    status: String, 
    evaluation: String, 
    startTime: String,
    endTime: String,
    slug: { type: String, slug: 'taskName', unique: true },
  }, {
    timestamps: true,
});

//Add plugins
mongoose.plugin(slug);
Task.plugin(mongoose_delete, { 
  deletedAt: true,
  overrideMethods: 'all' 
})

  module.exports = mongoose.model('Task', Task);