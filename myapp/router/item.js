var express = require('express');
var path = require('path');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');

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
    console.log('get board detail 호출');

    var id = req.params.id;
    console.log('params : ' + id);

    BoardSchema.findById(id).exec( function (err, result) {
        if(err){
            console.error(err);
            return;
        }

        result.view++;
        result.save();

        console.dir(result);
        console.log(result.files);

        if(result){
            res.render('board_detail', {board : result})
        }else{
            console.log('데이터 없음');
        }
    })
})

router.get('/update/:id', function (req, res) {
    console.log('get board update 호출');

    var id = req.params.id;
    var author = req.session.username;
    console.log('params : ' + id + ', ' + author);

    BoardSchema.findOne({_id : id, author : author}, function (err, result) {
        if(err){
            console.error(err);
            return;
        }

        if(result){
            res.render('board_update', {board : result});
        }else{
            console.log('데이터 없음');
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            res.status(500).end('권한이 없습니다.');
        }
    })
})

router.post('/update/:id', function (req, res) {
    console.log('post board update 호출');

    var id = req.params.id;
    var author = req.session.username;
    var title = req.body.title || req.query.title;
    var content = req.body.content || req.query.content;
    console.log('params : ' + id + ', ' + title + ', ' + content);

    BoardSchema.update({_id : id, author : author}, {$set : {title : title, content : content}}, function (err, result) {
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

module.exports = router;