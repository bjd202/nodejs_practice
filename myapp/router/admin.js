var express = require('express');
var router = express.Router();

var UserSchema = require('../schemas/UserSchema');

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

module.exports = router;