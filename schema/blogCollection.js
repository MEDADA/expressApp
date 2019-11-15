let mongoose = require('../db');
let Schema = mongoose.Schema;
const blogCollectionSchema = new Schema({
    userId:{
        required:true,
        type:String
    },
    blogId:{
        required:true,
        type:String
    }
});
module.exports = mongoose.model('blogCollection',blogCollectionSchema);