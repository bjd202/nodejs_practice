var express = require('express');
var path = require('path');
var router = express.Router();
var crypto = require('crypto');


var UserSchema = require('../schemas/UserSchema');

router.get('/', function(req, res) {
    console.log('main 호출');

    console.log('session username = ' + req.session.username);

    if(typeof req.session.username == 'undefined'){
        res.redirect('/login');
        return;
    }

    //res.sendFile(path.join(__dirname, '../public/', 'main.html'));
    res.render('main')
});

router.get('/login', function(req, res) {
    console.log('login 호출');
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
                req.session.name = result.name;
                res.json({result : 1});
                return;
            }else{
                req.session.username = undefined;
                req.session.name = undefined;
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
    console.log('register 호출');
    res.sendFile(path.join(__dirname, '../public/', 'register.html'));
})

router.post('/register', function (req, res) {
    console.log('post register 호출');

    var name = req.body.name;
    var username = req.body.username || req.query.username;
    var inputPassword = req.body.password || req.query.password;
    var email = req.body.email || req.query.email;

    console.log(req.body);

    UserSchema.findOne({username : username}).exec(function (err, result) {
        if(err){
            console.error(err);
            return;
        }

        if(result){
            // 이미 가입된 사용자
            console.dir(result);
            res.json({result : 0});                
        }else{
            // 새로운 사용자
            var salt = Math.round((new Date().valueOf() * Math.random())) + "";
            var hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
        
            var user = new UserSchema();
        
            user.name = name;
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
    })
})

router.get('/logout', function (req, res) {
    req.session.username = undefined;

    res.redirect('/login');
})

module.exports = router;