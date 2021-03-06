const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongoose_delete = require('mongoose-delete');
const Schema = mongoose.Schema;

const User = new Schema({
    fullName: { type: String},
    avatar: { type: String},
    password: { type: String},
    role: { type: String},
    gender: String,
    age: String, 
    numberPhone: String,
    email: String,
    slug: { type: String, slug: 'fullName', unique: true },
  }, {
    timestamps: true,
});

//Add plugins
mongoose.plugin(slug);
User.plugin(mongoose_delete, { 
  deletedAt: true,
  overrideMethods: 'all' 
})

  module.exports = mongoose.model('User', User);