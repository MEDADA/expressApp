var express = require('express');
var router = express.Router();

var jwt = require('jwt-simple');

let Face_descriptors = require('../schema/faceDescriptors');
// get blog category
router.post('/getUserFaceDescriptors', function (req, res) {  //获取用户人脸描述数据
    let tokenStr = req.cookies.token;
    let token = jwt.decode(tokenStr, '1116');
    let name = token.name;
    console.log(token.name);
    if (name) {
        Face_descriptors.findOne({name}, (err, data) => {
            if (err) {
                res.send({
                    success: 'false',
                    message: err.message
                })
            } else {
                res.send({data})
            }
        })
    } else {
        res.send({
            message: '请登陆'
        })
    }
});
// get blog category
router.get('/getAllFaceName', function (req, res) {  //获取全部数据库内人脸姓名
    Face_descriptors.find({}, (err, data) => {
        if (err) {
            res.send({
                success: 'false',
                message: err.message
            })
        } else {
            let _data = data.map((item)=>{
                return item.name
            });
            res.send({data:_data })
        }
    })
});
router.post('/getFaceDescriptors', function (req, res) {  //获取人脸描述据
    let name = req.body.peopleName;  //姓名 唯一索引
    Face_descriptors.findOne({name}).exec((err, data) => {
        if(err) {
            res.send(err)
        }else{
            res.send(data)
        }
    });
});
router.post('/saveFaceDescriptors', function (req, res) {  //新建人脸有效数据
    let name = req.body.peopleName;  //姓名 唯一索引
    let descriptors = req.body.descriptors;  //人脸描述数据
    let faceDescriptors = new Face_descriptors({name, descriptors});
    Face_descriptors.findOne({name}).exec((err, data) => {
        if(err) {
            res.send(err)
        }else{
            if(data){
                Face_descriptors.updateOne({name},{
                    descriptors
                }).exec((err,data)=>{
                    if (err) {
                        res.send(err)
                    } else {
                        res.send(data)
                    }
                })
            }else{

                faceDescriptors.save((err, data) => {
                    if (err) {
                        res.send(err)
                    } else {
                        res.send(data)
                    }
                })
            }
        }
    });
});
module.exports = router;