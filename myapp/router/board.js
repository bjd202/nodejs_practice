var express = require('express');
var path = require('path');
var router = express.Router();

router.get('/list', function (req, res) {
    console.log('board list 호출');
    
    //res.sendFile(path.join(__dirname, '../public', 'board.html'));
    res.render('board')
})

router.get('/create', function (req, res) {
    console.log('get board create 호출');

    res.render('board_create');
})

router.post('/create', function (req, res) {
    console.log('post board create 호출');
})

module.exports = router;