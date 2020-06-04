var express = require('express');
var router = express.Router();

var UserSchema = require('../schemas/UserSchema');
var RequestSchema = require('../schemas/RequestSchema')

router.get('/user/list/:page', function (req, res) {
    console.log('get user list');

    var page = req.params.page;

    var options = {
        page : page,
        limit : 10,
        sort : {create_at : -1}
    }

    var aggregate = UserSchema.aggregate();
    UserSchema.aggregatePaginate(aggregate, options, function (err, result) {
        if(err){
            console.error(err);
            return;
        }

        if(result){
            console.log(result);
            res.render('user_list', {user : result});
        }else{
            console.log('데이터 없음');
        }
    })
})

router.get('/user/detail/:id', function (req, res) {
    console.log('get user detail');

    var id = req.params.id;

    UserSchema.findById(id, function (err, result) {
        if(err){
            console.error(err);
            return;
        }

        if(result){
            console.dir(result);
            res.render('user_detail', {user : result});
        }else{
            console.log('데이터 없음');
        }
    })
})

router.get('/request/list/:page', function (req, res) {
    console.log('get admin request list');

    var page = req.params.page;

    var options = {
        page : page,
        limit : 10,
        sort : {create_at : -1}
    }

    var aggregate = RequestSchema.aggregate();
    RequestSchema.aggregatePaginate(aggregate, options, function (err, result) {
        if(err){
            console.error(err);
            return;
        }

        if(result){
            console.log(result);
            res.render('admin_request_list', {request : result});
        }else{
            console.log('데이터 없음');
        }
    })
})

router.post('/request/detail/modal', function (req, res) {
    console.log('admin request detail modal post');

    var id = req.body.request_id;

    RequestSchema.findById(id, function (err, result) {
        if(err){
            console.error(err);
            res.json({result : 0});
            return;
        }

        if(result){
            console.dir(result);
            res.json({result : 1, detail : result});
            return;
        }
    })
})

router.post('/request/update/modal', function (req, res) {
    console.log('admin request update modal post');

    var id = req.body.request_id;
    var accept_or_not = req.body.accept_or_not;

    RequestSchema.updateOne({_id : id}, {$set : {accept_or_not : accept_or_not, update_at : new Date()}}, function (err, result) {
        if(err){
            console.error(err);
            res.json({result : 0});
            return;
        }

        if(result){
            res.json({result : 1});
            return;
        }else{
            console.log('update 실패');
            res.json({result : 0});
            return;
        }
    })
})

module.exports = router;