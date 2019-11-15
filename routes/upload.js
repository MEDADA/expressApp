var express = require('express');
var router = express.Router();
let fs = require('fs');
var path = require('path');
let formidable = require('formidable');
const gm = require('gm');
let uploadImageSchema = require('../schema/uploadImages');
/* POST upload listing. */

router.post('/', function (req, res) {
    let http = 'http://192.168.18.29:3000';
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = "./public/upload/temp";  //上传文件存储路径
    form.keepExtensions = true;
    form.parse(req, function (error, fields, files) {
        if (error) {
            res.send({
                success: 'false',
                error: error
            })
        } else {
            if (files.file) {
                let _path = files.file.path;

                if (_path.indexOf('public') !== -1) {
                    _path = _path.replace(/\\/g, '/');
                    _path = _path.slice(6, _path.length);
                }

                let thumbnailPath = '';
                gm('./public' + _path)
                    .resize(640, 640)
                    .noProfile()
                    .write('./public/upload/temp/' + files.file.name + 'thumbnail.jpg', function (err) {
                        if (!err) {
                            thumbnailPath = http+'/upload/temp/' + files.file.name + 'thumbnail.jpg';
                            let uploadImages = new uploadImageSchema({
                                title: files.file.name,
                                imageUrl: http + _path,
                                thumbnail: thumbnailPath
                            });
                            uploadImages.save((err, data) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    res.send(data);
                                }
                            });
                        }
                    });
            }
        }

    });
});

module.exports = router;
