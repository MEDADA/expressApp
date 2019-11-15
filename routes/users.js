var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
let userSchema = require('../schema/user');
let blogCollection = require('../schema/blogCollection');
let Blog = require('../schema/blog');
var jwt = require('jwt-simple');
/* GET users listing. */
// addUser
router.post('/addUser', function (req, res) {
    let user = new userSchema({
        name: req.body.name,
        sex: req.body.sex,
        birthday: req.body.birthday,
        phone: req.body.phone,
        area: req.body.area,
        photo: req.body.photo,
    });
    user.save(function (err, data) {
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
// getUserList
router.post('/getUserList', function (req, res) {
    userSchema.find({}, (err, data) => {
        if (err) return console.log(err);
        res.send(data)
    })
});
//deleteUser
router.post('/deleteUser', function (req, res) {
    userSchema.remove({_id: req.body.id}, (err, data) => {
        if (err) return console.log(err);
        res.send(data)
    })
});
//updateUser
router.post('/updateUser', function (req, res) {
    let name = req.body.name;
    let birthday = req.body.birthday;
    let phone = req.body.phone;
    let sex = req.body.sex;
    let update = {
        name, birthday, phone, sex
    };
    let updated = {};
    for (let i in update) {
        if (update[i]) {
            updated[i] = update[i]
        }
    }
    userSchema.findByIdAndUpdate(req.body.id, updated, {
        new: true
    }, (err, data) => {
        if (err) return console.log(err);
        res.send(data)
    })
});

//User collection
router.get('/userCollection', function (req, res) {
    let tokenStr = req.cookies.token;
    let token = jwt.decode(tokenStr, '1116');
    let userId = token.id;
    console.log(userId);
    blogCollection.findOne({userId}).exec(function (err, data) {
        if (err) {
            res.send(err)
        } else {
            if(data.blogId !== ''){
                let blogList = data.blogId.split(',');
                console.log(blogList);
                Blog.find({_id: {$in: blogList}}).populate('poster').exec(function (err, data) {
                    if (err) {
                        res.send(err)
                    } else {
                        res.send(data)
                    }
                })
            }else{
                data = [];
                res.send(data)
            }
        }
    })
});
//User collection
router.post('/removeCollection', function (req, res) {
    let tokenStr = req.cookies.token;
    let token = jwt.decode(tokenStr, '1116');
    let userId = token.id;
    let blogId = req.body.id;
    blogCollection.findOne({userId}).exec(function (err, data) {
        if (err) {
            res.send(err)
        } else {
            let findInd = data.blogId.indexOf(blogId);
            if (findInd !== -1) {
                let blogList = data.blogId.split(',');
                blogList.find((v,i)=>{
                    if(v === blogId){
                        blogList.splice(i,1);
                        blogId = blogList.join(',');
                        return true
                    }
                });
                blogCollection.update({userId}, {blogId}).exec(function (err, data) {
                    if (err) {
                        res.send(err)
                    } else {
                        res.send(data)
                    }
                })
            }
        }
    })
});
module.exports = router;
