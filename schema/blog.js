let mongoose = require('../db');
let Schema = mongoose.Schema;
const blogSchema = new Schema({
    title:{  //标题
        required:true,
        type:String
    },
    createDate:{  //创建时间
        type:Date,
        default:Date.now
    },
    user:{  //用户
        type:String
    },
    context:{  //内容
        required:true,
        type:String
    },
    pageview:{  //浏览数
        type:Number,
        default:0
    },
    like:{  //点赞数
        type:Number,
        default:0
    },
    categoryName:{
        type:String,
    },
    category:{
        type: Schema.Types.ObjectId,
        ref:'blogCategorySchema'
    },
    poster:{
        type: Schema.Types.ObjectId,
        ref:'uploadImagesSchema'
    }
});
module.exports = mongoose.model('blogSchema',blogSchema);