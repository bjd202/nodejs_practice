var express = require('express');
var router = express.Router();

var UserSchema = require('../schemas/UserSchema');

var moment = require('moment');

router.post('/punch_in_out', function (req, res) {
    console.log('post punch_in_out');

    var category = req.body.category;
    var now = new Date()
    var time = moment(now).format('YYYY-MM-DD HH:mm:ss');
    var username = req.session.username;

    var punch_in_out = {
        category : category,
        time : time
    }

    UserSchema.update({username : username}, {$push : {punch_in_out : punch_in_out}}, function (err, result) {
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

router.post('/punch_in_out_check', function (req, res) {
    console.log('post punch_in_out_check');

    var username = req.session.username;
    
    UserSchema.findOne({username : username}, function (err, result) {
        if(err){
            console.error(err)
            return;
        }

        if(result){
            console.dir(result)
            res.json({punch_in_out : result.punch_in_out});
            return;
        }
    })
})

module.exports = router;