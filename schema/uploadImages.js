let mongoose = require('../db');
let Schema = mongoose.Schema;
const UploadImagesSchema = new Schema({
    title:{
        required:true,
        type:String
    },
    imageUrl:{
        type:String
    },
    thumbnail:{
        type:String
    }
});
module.exports = mongoose.model('uploadImagesSchema',UploadImagesSchema);