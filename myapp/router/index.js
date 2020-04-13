var express = require('express');
var path = require('path');
var router = express.Router();
var crypto = require('crypto');


var UserSchema = require('../schemas/UserSchema');

router.get('/', function(req, res) {
    console.log('main.html 호출');

    console.log('session username = ' + req.session.username);

    if(typeof req.session.username == 'undefined'){
        res.redirect('/login');
        return;
    }

    res.sendFile(path.join(__dirname, '../public/', 'main.html'));
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

    if(username == "" || password == ""){
        res.json({result : 0});
        return;
    }

    UserSchema.findOne({username : username}).exec(function (err, result) {
        if(err){
            console.error(err.stack);
            return;
        }

        if(result){
            console.dir(result._doc);

            var dbPassword = result._doc.password;
            var inputPassword = password;
            var salt = result._doc.salt;
            var hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

            if(dbPassword == hashPassword){
                req.session.username = username;
                res.json({result : 1});
                return;
            }else{
                req.session.username = null;
                res.json({result : 0});
                return;
            }
            
        }else{
            console.log('db 결과 없음');
            res.json({result : 0});
        }
    })
})

router.get('/register', function (req, res) {
    console.log('register.html 호출');
    res.sendFile(path.join(__dirname, '../public/', 'register.html'));
})

router.post('/register', function (req, res) {
    console.log('post register 호출');
    var username = req.body.username || req.query.username;
    var inputPassword = req.body.password || req.query.password;
    var email = req.body.email || req.query.email;

    UserSchema.findOne({username : username}).exec(function (err, result) {
        if(err){
            console.error(err.stack);
            return;
        }

        if(result){
            // 이미 가입된 사용자
            if(result._doc.username == username){
                res.json({result : 0});
            // 새로운 사용자
            }else{
                var salt = Math.round((new Date().valueOf() * Math.random())) + "";
                var hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
            
                var user = new UserSchema();
            
                user.username = username;
                console.log(user.username);
                user.password = hashPassword;
                user.email = email
                user.salt = salt
            
                user.save(function(err){
                    if(err){
                        console.error(err);
                        res.json({result: 0});
                        return;
                    }
                });
            
                res.json({result : 1});
            }
        }
    })
})

module.exports = router;