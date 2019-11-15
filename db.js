var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true });

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error;'));
db.once('open', function () {
    console.log('Mongodb Connected Success!!!')
});
module.exports = mongoose;