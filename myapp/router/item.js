var express = require('express');
var path = require('path');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var moment = require('moment');

var upload = multer({
    dest : "upload/item/"
})

var ItemSchema = require('../schemas/ItemSchema');

router.get('/list/:page', function (req, res) {
    console.log('item list 호출');

    var page = req.params.page;

    var options = {
        page : page,
        limit : 10,
        sort : {create_at : -1}
    }

    var aggregate = ItemSchema.aggregate();
    ItemSchema.aggregatePaginate(aggregate, options, function (err, results) {
        if(err){
            console.error(err);
            return;
        }

        if(results){
            console.log(results);
            res.render('item_list', {item : results});
        }else{
            console.log('데이터 없음');
        }
    })

    
})

router.get('/create', function (req, res) {
    console.log('get item create 호출');

    res.render('item_create');
})

router.post('/create', upload.array("file"), function (req, res) {
    console.log('post item create 호출');

    var name = req.body.name || req.query.name;
    var category = req.body.category || req.query.category;
    var number = req.body.number || req.query.number;
    var desc = req.body.desc || req.query.desc;
    var author = req.session.username;
    var files = req.files;

    console.log('---file 객체---');
    console.dir(files);

    console.log(req.body || req.query);

    var item = new ItemSchema();

    item.name = name;
    item.category = category;
    item.number = number;
    item.desc = desc;
    item.author = author;

    if(typeof files != 'undefined'){
        for(var i=0; i<files.length; i++){
            var obj = {};

            obj.filename = files[i].filename;
            obj.originalname = files[i].originalname;
            obj.path = files[i].path;
            obj.size = files[i].size;
            obj.mimetype = files[i].mimetype;

            item.files.push(obj);
        }
    }
    

    item.save(function (err) {
        if(err){
            console.error(err);
            res.json({result : 0});
            return;
        }
    })

    res.json({result : 1});
})

router.get('/detail/:id', function (req, res) {
    console.log('get item detail 호출');

    var id = req.params.id;
    console.log('params : ' + id);

    ItemSchema.findById(id).exec( function (err, result) {
        if(err){
            console.error(err);
            return;
        }

        console.dir(result);

        if(result){
            res.render('item_detail', {item : result, moment : moment})
        }else{
            console.log('데이터 없음');
        }
    })
})

router.get('/update/:id', function (req, res) {
    console.log('get item update 호출');

    var id = req.params.id;
    var author = req.session.username;
    console.log('params : ' + id + ', ' + author);

    ItemSchema.findOne({_id : id, author : author}, function (err, result) {
        if(err){
            console.error(err);
            return;
        }

        if(result){
            res.render('item_update', {item : result});
        }else{
            console.log('데이터 없음');
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            res.status(500).end('권한이 없습니다.');
        }
    })
})

router.post('/update/:id', function (req, res) {
    console.log('post item update 호출');

    var id = req.params.id;
    var author = req.session.username;
    var name = req.body.name;
    var category = req.body.category;
    var desc = req.body.desc;

    console.log(req.body);

    BoardSchema.update({_id : id, author : author}, {$set : {name : name, category : category, desc : desc, update_at : new Date()}}, function (err, result) {
        if(err){
            console.error(err);
            return;
        }

        if(result){
            res.json({result : 1});
        }else{
            console.log('update 실패');
            res.json({result : 0});
        }
    })
})

router.post('/delete/:id', function (req, res) {
    console.log('post board delete');

    var id = req.params.id;
    var author = req.session.username;

    BoardSchema.deleteOne({_id : id, author : author}, function (err, result) {
        if(err){
            console.error(err);
            res.json({result : 0});
            return;
        }

        if(result.deletedCount > 0){
            console.dir(result);
            res.json({result : 1});
        }else{
            console.log('데이터 없음');
            res.json({result : 0});
        }
        
        
    })
})

router.get('/download/:id/:fileid', function (req, res) {
    console.log('get board download');

    var id = req.params.id;
    var fileid = req.params.fileid;

    console.log('params : ' + id + ', ' + fileid);

    BoardSchema.findOne({_id : id}, function (err, result) {
        if(err){
            console.error(err);
            return;
        }

        if(result){
            console.log(result);

            for(var i=0; i<result.files.length; i++){
                if(fileid == result.files[i]._id){
                    var originalname = result.files[i].originalname;
                    var filepath = "E:/nodejs/upload/board/" + result.files[i].filename;
                    console.log(filepath);

                    res.setHeader('Content-Disposition', 'attachment;filename=' + encodeURI(originalname))
                    res.setHeader('Content-Type', 'binary/octet-stream')

                    var fileStream = fs.createReadStream(filepath);
                    fileStream.pipe(res);
                }
            }
        }else{
            console.log('데이터 없음');
        }
    })
})

router.post('/detail/search', function (req, res) {
    console.log('post detail search');

    var id = req.body.id;
    var start_dt = req.body.start_dt;
    var end_dt = req.body.end_dt;
    var category = req.body.category;
    var number = req.body.number;
    var desc = req.body.desc;

    console.log(req.body);

    console.log(start_dt)
    console.log(end_dt)

    ItemSchema.findById(id, function (err, result) {
        if(err){
            console.error(err);
            res.json({result : 0});
            return;
        }

        if(result){
            var arr = [];
            var history = result.history;

            if(category == 'all'){
                for(var i=0; i<history.length; i++){
                    if(history[i].date >= new Date(start_dt) && history[i].date <= new Date(end_dt)){
                        arr.push(history[i]);
                    }
                }
            }else{
                for(var i=0; i<history.length; i++){
                    if(history[i].category == category && history[i].date >= new Date(start_dt) && history[i].date <= new Date(end_dt)){
                        arr.push(history[i]);
                    }
                }
            }

            res.json({result : 1, searched_list : arr});
        }
    })
})

router.post('/detail/inout', function (req, res) {
    console.log('post detail inout');

    var id = req.body.id;
    var date = req.body.date;
    var category = req.body.category;
    var number = req.body.number;
    var desc = req.body.desc;

    var history = {
        date : date,
        category : category,
        number : number,
        desc : desc
    }

    if(category == 'out'){
        number = number * -1;
    }

    ItemSchema.update({_id : id}, 
        {
            $push : {history : history},
            $inc : {number : number},
        }, function (err, result) {
        if(err){
            console.error(err);
            res.json({result : 0});
            return;
        }

        if(result){
            console.log(result);
            res.json({result : 1});
            return;
        }
    })
        
})

module.exports = router;