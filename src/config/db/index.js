const mongoose = require('mongoose');

async function connect() {
    try {
        await moogoose.connect('mongodb://127.0.0.1:27017/f8_education_dev', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        }); 
       console.log('THANH CONG');
    }
    catch (error) {
       // console.log('FFFFFF');
    }
}

mongoose.connect('mongodb://localhost:27017/f8_education_dev', {useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true}, 
    function (err) {
        if (err) throw err;
    
        console.log('Successfully connected');
  
 });

module.exports = { connect };