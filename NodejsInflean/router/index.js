var express=require('express');
var app=express();
var router=express.Router();
var path=require('path');

var main=require('./main')

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../public/main.html'))
})

router.use('/main', main);

module.exports=router;