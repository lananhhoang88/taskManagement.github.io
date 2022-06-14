module.exports = {
    multipleMongooseToObject: function (mongooses) {
        return mongooses.map(mongoose => mongoose.toObject());
    },
    mongooseToObject: function (mongoose) {
        return mongoose ? mongoose.toObject() : mongoose;
    },
    padLeft: function (value) {
        return value.toString().padStart(2, '0');
    }
};