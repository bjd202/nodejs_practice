var express = require('express');
var router = express.Router();

var RequestSchema = require('../schemas/RequestSchema');

var moment = require('moment');

router.get('/list/:page', function (req, res) {
    console.log('get request list');

    var page = req.params.page;
    var username = req.session.username;

    var options = {
        page : page,
        limit : 10,
        sort : {create_at : -1}
    }

    var aggregate = RequestSchema.aggregate().match({username : username});
    RequestSchema.aggregatePaginate(aggregate, options, function (err, result) {
        if(err){
            console.error(err);
            return;
        }

        if(result){
            console.log(result);
            res.render('request_list', {request : result});
        }else{
            console.log('데이터 없음');
        }
    })
})

router.get('/create', function (req, res) {
    console.log('get request create get');

    res.render('request_create');
})

router.post('/create', function (req, res) {
    console.log('post request create');

    var username = req.session.username;
    var name = req.session.name;
    var title = req.body.title;
    var desc = req.body.desc;
    var category = req.body.category;
    var start_dt = req.body.start_dt;
    var end_dt = req.body.end_dt;

    var request = new RequestSchema();

    request.username = username;
    request.name = name;
    request.title = title;
    request.desc = desc;
    request.category = category;
    request.start_dt = start_dt;
    request.end_dt = end_dt;

    request.save(function (err) {
        if(err){
            console.error(err);
            return;
        }
    })

    res.json({result : 1});
})

module.exports = router;