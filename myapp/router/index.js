var express = require('express');
var path = require('path');
var router = express.Router();

var UserSchema = require('../schemas/UserSchema');

router.get('/', function(req, res) {
    console.log('index.html 호출');
    res.sendFile(path.join(__dirname, '../public/', 'index.html'));
});

router.get('/login', function(req, res) {
    console.log('login.html 호출');
    res.sendFile(path.join(__dirname, '../public/', 'login.html'));
});

router.post('/logincheck', function (req, res) {
    console.log('logincheck 호출');

    var username = req.body.username || req.query.username;
    var password = req.body.password || req.query.password;

    console.log('param data : ' + username + ', ' + password);

    UserSchema.findOne({username : username}).exec(function (err, result) {
        if(err){
            console.error(err.stack);
        }

        if(result){
            console.dir(result);
            res.json({result : 1});
        }else{
            console.log('db 결과 없음');
            res.json({result : 0});
        }
    })

    // var user = new UserSchema();

    // user.username = username;
    // user.password = password;

    // user.save(function(err){
    //     if(err){
    //         console.error(err);
    //         res.json({result: 0});
    //         return;
    //     }

    //     res.json({result: 1});

    // });
})

module.exports = router;