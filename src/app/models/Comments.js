const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongoose_delete = require('mongoose-delete');
const Schema = mongoose.Schema;

const Comment = new Schema({
    content: { type: String },
    idUser: { type: String },
    itemId: { type: String },
    created: { type: Date }
}, {
    timestamps: true,
});

//Add pluginss
// mongoose.plugin(slug);
Comment.plugin(mongoose_delete, {
    deletedAt: true,
    overrideMethods: 'all'
})

module.exports = mongoose.model('Comment', Comment);
// Cái Id kia k để nó tự generate à e. Bình thường e phải tự set Id = ... à
//Mongo nó tự có trường id rùi ạ
// A xóa Id và cái slug kia đi có dc k Được ạ
// Nó báo duplicate key nà, thôi cứ để slug kia đi á
// E phải xem nó báo duplicate ở đâu chứ
// E thử fix xem nào, a chưa dùng cái slug này bao h nên chưa hiểu nó là cái gì Vâng ạ
