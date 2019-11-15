let mongoose = require('../db');
let Schema = mongoose.Schema;
const userSchema = new Schema({
    name:{
        required:true,
        type:String
    },
    sex:{
        required:false,
        type:String
    },
    birthday:{
        required:false,
        type:String
    },
    phone:{
        required:false,
        type:String
    },
    area:{
        type:String
    },
    level:{
        type:String,
    },
    photo:{
        ref:'uploadImagesSchema',
        type:Schema.Types.ObjectId
    }
});
module.exports = mongoose.model('userSchema',userSchema);