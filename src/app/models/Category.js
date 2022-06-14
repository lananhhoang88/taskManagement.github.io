const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongoose_delete = require('mongoose-delete');
const Schema = mongoose.Schema;

const Category = new Schema({
    categoryName: { type: String},
    description: { type: String},
    slug: { type: String, slug: 'categoryName', unique: true },
  }, {
    timestamps: true,
});

//Add plugins
mongoose.plugin(slug);
Category.plugin(mongoose_delete, { 
  deletedAt: true,
  overrideMethods: 'all' 
})

module.exports = mongoose.model('Category', Category);
