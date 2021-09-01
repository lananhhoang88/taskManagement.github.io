const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongoose_delete = require('mongoose-delete');
const Schema = mongoose.Schema;

const Course = new Schema({
    name: { type: String, required: true},
    decrip: String,
    image: String,
    level: String,
    slug: { type: String, slug: 'name', unique: true },
  }, {
    timestamps: true,
});

//Add plugins
mongoose.plugin(slug);
Course.plugin(mongoose_delete, { 
  deletedAt: true,
  overrideMethods: 'all' 
})

  module.exports = mongoose.model('Course', Course);