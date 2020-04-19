var express = require('express');
var path = require('path');
var router = express.Router();

var BoardSchema = require('../schemas/BoardSchema');

router.get('/list', function (req, res) {
    console.log('board list 호출');
    
    //res.sendFile(path.join(__dirname, '../public', 'board.html'));
    BoardSchema.find(function (err, board) {
        if(err){
            console.error(err);
            res.json({result : 0});
            return;
        }

        if(board){
            console.dir(board);
            //res.json({result : 1, board : board._doc});
            res.render('board', {result : 1, board : board});
        }else{
            console.log('데이터 없음');
            res.render('board', {result : 0});
        }
    })

    
})

router.get('/create', function (req, res) {
    console.log('get board create 호출');

    res.render('board_create');
})

router.post('/create', function (req, res) {
    console.log('post board create 호출');

    var title = req.body.title || req.query.title;
    var content = req.body.content || req.query.content;
    var author = req.session.username;

    console.log('params : ' + title + ', ' + content + ', ' + author);

    var board = new BoardSchema();

    board.title = title;
    board.content = content;
    board.author = author;

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

    BoardSchema.findById(id, function (err, result) {
        if(err){
            console.error(err);
            return;
        }

        result.view++;
        result.save();

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

module.exports = router;