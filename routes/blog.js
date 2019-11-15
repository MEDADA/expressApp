var express = require('express');
var router = express.Router();
let Blog = require('../schema/blog');
let BlogCategory = require('../schema/blogCategory');
let BlogCollection = require('../schema/blogCollection');
var jwt = require('jwt-simple');
// get blog category
router.post('/getBlogCategory', function (req, res) {
    BlogCategory.find({}, (err, data) => {
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

// create blog
router.post('/createBlog', function (req, res) {
    let title = req.body.title;
    let createDate = req.body.createDate;
    let user = req.body.user;
    let context = req.body.context;
    let pageview = req.body.pageview;
    let like = req.body.like;
    let categoryName = req.body.categoryName;
    let poster = req.body.posterId;

    let blog = new Blog({
        title,
        createDate,
        user,
        context,
        pageview,
        like,
        poster
    });

    BlogCategory.findOne({name: categoryName}, function (err, data) {
        if (err) {

        } else {
            if (!data) {
                let blogCategory = new BlogCategory({
                    name: categoryName
                });
                blogCategory.save((err2, data) => {
                    if (err2) {
                        console.log(err2);
                    } else {
                        blog.category = data._id;
                        blog.save((err, data) => {
                            if (err) {
                                res.send({
                                    success: 'false',
                                    message: err.message
                                })
                            } else {
                                res.send(data)
                            }
                        });
                    }
                });
            } else {
                blog.category = data._id;
                blog.save((err, data) => {
                    if (err) {
                        res.send({
                            success: 'false',
                            message: err.message
                        })
                    } else {
                        res.send(data)
                    }
                });
            }
        }
    });
});
// remove blog
router.post('/removeBlog', function (req, res) {
    Blog.remove({_id: req.body.id}, (err, data) => {
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
router.post('/collectionBlog', function (req, res) {
    let tokenStr = req.cookies.token;
    let token = jwt.decode(tokenStr, '1116');
    let blogId = req.body.blogId;
    let userId = token.id;
    let blogCollection = new BlogCollection({
        blogId,
        userId
    });
    BlogCollection.findOne({userId}).exec(function (err, data) {
        if (err) {
            res.send(err)
        } else {
            console.log(data);
            if (data) {
                let blogList = data.blogId;
                if (blogList.indexOf(blogId) === -1) {
                    let blogArr = blogList.split(',');
                    blogArr.push(blogId);
                    let _blogId = blogArr.join(',');
                    BlogCollection.updateOne({userId}, {blogId: _blogId}).exec(function (err, data) {
                        if (err) {
                            res.send(err)
                        } else {
                            res.send(data)
                        }
                    })
                } else {
                    res.send({
                        message: '已经收藏过了'
                    })
                }
            } else {
                blogCollection.save(function (err, data) {
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
// query blog list
router.post('/getBlogList', function (req, res) {
    let limit = parseInt(req.body.limit) || 10;
    let pagination = parseInt(req.body.pagination || 1);
    let category = req.body.category;
    let options = {};
    if (category && category !== '') {
        options = {
            category
        }
    }
    Blog.countDocuments(options).exec(function (err, count) {
        let totalPage = Math.ceil(count / limit);
        let total = count;

        Blog.find(options).populate('poster').limit(limit).sort({createDate: 1}).skip((pagination - 1) * limit).exec((err, list) => {
            if (err) {
                res.send({
                    success: 'false',
                    message: err.message
                })
            } else {
                res.send({
                    list,
                    totalPage,
                    total
                })
            }
        })
    })
});

// get blog detail
router.post('/getBlogDetail', function (req, res) {
    let _id = req.body.id;
    if (!_id) res.send({error: '查询id不能为空'});
    let tokenStr = req.cookies.token;
    let token;
    if (tokenStr) token = jwt.decode(tokenStr, '1116');
    Blog.findOne({_id}).populate('poster').exec(
        function (err, data) {
            if (err) {
                res.send({
                    success: 'false',
                    message: err.message
                })
            } else {
                let pageview = data.pageview + 1; //更新浏览数
                Blog.updateOne({_id}, {pageview}).exec(function (err, data2) {
                    if (err) {
                        res.send(err)
                    } else {
                        if (token && token.id) {
                            BlogCollection.find({userId: token.id, blogId: {$regex: _id}}).exec((err, data3) => {
                                if (err) {
                                    res.send(err)
                                } else {
                                    console.log(data3);
                                    if(data3.length > 0){
                                        res.send({
                                            data,
                                            collected:true
                                        });
                                    }else{
                                        res.send({data})
                                    }
                                }
                            })
                        } else {
                            res.send({data});
                        }
                    }
                });
            }
        }
    )
});

router.post('/getBlogCategory', function (req, res) {

    BlogCategory.find({}, (err, data) => {
        if (err) {
            res.send({success: 'false', message: err.message});
            return false
        }
        res.send(data)
    })

});
module.exports = router;
