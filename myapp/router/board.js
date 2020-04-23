var express = require('express');
var path = require('path');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');

var upload = multer({
    dest : "upload/board/"
})

var BoardSchema = require('../schemas/BoardSchema');

router.get('/list/:page', function (req, res) {
    console.log('board list 호출');

    var page = req.params.page;

    var options = {
        page : page,
        limit : 10,
        sort : {create_at : -1}
    }
    
    // BoardSchema.find(function (err, board) {
    //     if(err){
    //         console.error(err);
    //         res.json({result : 0});
    //         return;
    //     }

    //     if(board){
    //         console.dir(board);
    //         //res.json({result : 1, board : board._doc});
    //         res.render('board', {result : 1, board : board});
    //     }else{
    //         console.log('데이터 없음');
    //         res.render('board', {result : 0});
    //     }
    // })

    var aggregate = BoardSchema.aggregate();
    BoardSchema.aggregatePaginate(aggregate, options, function (err, results) {
        if(err){
            console.error(err);
            return;
        }

        if(results){
            console.log(results);
            res.render('board', {board : results});
        }else{
            console.log('데이터 없음');
        }
    })

    
})

router.get('/create', function (req, res) {
    console.log('get board create 호출');

    res.render('board_create');
})

router.post('/create', upload.array("file"), function (req, res) {
    console.log('post board create 호출');

    var title = req.body.title || req.query.title;
    var content = req.body.content || req.query.content;
    var author = req.session.username;
    var files = req.files;

    console.log('---file 객체---');
    console.dir(files);

    console.log('params : ' + title + ', ' + content + ', ' + author);

    var board = new BoardSchema();

    board.title = title;
    board.content = content;
    board.author = author;

    if(typeof files != 'undefined'){
        for(var i=0; i<files.length; i++){
            var obj = {};

            obj.filename = files[i].filename;
            obj.originalname = files[i].originalname;
            obj.path = files[i].path;
            obj.size = files[i].size;
            obj.mimetype = files[i].mimetype;

            board.files.push(obj);
        }
    }
    

    board.save(function (err) {
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
            res.status(500).json('권한 없음');
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