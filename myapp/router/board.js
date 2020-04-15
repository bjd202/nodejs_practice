var express = require('express');
var path = require('path');
var router = express.Router();

router.get('/list', function (req, res) {
    console.log('board list 호출');
    
    //res.sendFile(path.join(__dirname, '../public', 'board.html'));
    res.render('board')
})

module.exports = router;