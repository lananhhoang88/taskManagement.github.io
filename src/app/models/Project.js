const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongoose_delete = require('mongoose-delete');
const Schema = mongoose.Schema;

const Project = new Schema({
  projectName: { type: String, required: true },
  projectManager: { type: String },
  projectTeamMembers: { type: Array }, // Cái này a kb, nó viết như nào nhỉ
  description: String,
  status: String,
  startDate: String,
  dueDate: String,
  slug: { type: String, slug: 'projectName', unique: true },
}, {
  timestamps: true,
});

//Add plugins
mongoose.plugin(slug);
Project.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: 'all'
})

module.exports = mongoose.model('Project', Project);