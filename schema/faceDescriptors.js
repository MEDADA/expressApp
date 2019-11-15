let mongoose = require('../db');
let Schema = mongoose.Schema;
const createdSchema = new Schema({
    name:{  //标题
        required:true,
        type:String,
        unique:true
    },
    createDate:{  //创建时间
        type:Date,
        default:Date.now
    },
    descriptors:{  //内容
        type:Array
    }
});
module.exports = mongoose.model('faceDescriptorsSchema',createdSchema);