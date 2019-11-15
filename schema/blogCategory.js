let mongoose = require('../db');
let Schema = mongoose.Schema;
const blogCategorySchema = new Schema({
    name:{
        required:true,
        type:String
    }
});
module.exports = mongoose.model('blogCategorySchema',blogCategorySchema);