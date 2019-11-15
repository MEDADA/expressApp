var express = require('express');
var router = express.Router();

let uploadImageSchema = require('../schema/uploadImages');
// get blog category
router.post('/getImageDataInfo', function (req, res) {
    uploadImageSchema.countDocuments({}).exec((err, count) => {
        if (err) {

            res.send(err)
        } else {
            res.send({
                count
            })
        }
    })
});


module.exports = router;
