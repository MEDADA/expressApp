var express = require('express');
var router = express.Router();
    /* GET home page. */

let uploadImageSchema = require('../schema/uploadImages');
// get blog category
router.post('/getImageList', function (req, res) {
    uploadImageSchema.find({}, (err, data) => {
        if (err) {
            res.send({
                success: 'false',
                message: err.message
            })
        } else {
            res.send(data)
        }
    })
});


module.exports = router;
