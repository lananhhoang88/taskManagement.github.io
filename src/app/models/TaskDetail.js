const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongoose_delete = require('mongoose-delete');
const Schema = mongoose.Schema;

const TaskDetail = new Schema({
    taskDetailId: { type: String, unique: true},
    taskDetailName: { type: String, required: true},
    taskId: { type: String, required: true},
    userId: { type: String, required: true},
    description: String,
    status: String,
    slug: { type: String, slug: 'taskDetailName', unique: true },
  }, {
    timestamps: true,
});

//Add plugins
mongoose.plugin(slug);
TaskDetail.plugin(mongoose_delete, { 
  deletedAt: true,
  overrideMethods: 'all' 
})

  module.exports = mongoose.model('TaskDetail', TaskDetail);