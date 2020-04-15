const express = require('express')
const app = express()
const port = 3000
var path = require('path');
var http = require('http')
var mongoose = require('mongoose');
var session = require('express-session');

//mongoDB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/local', { useNewUrlParser: true, useUnifiedTopology : true })
.then(function () {
    console.log('connected successful');
})
.catch(function (err) {
    console.error(err);
})

//session
app.use(session({
    secret:'my key',
	resave:true,
	saveUninitialized:true
}))

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var index = require('./router/index');
var board = require('./router/board');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({extended : false}));

// 라우터
app.use(index);
app.use('/board', function (req, res, next) {
    console.log('session username = ' + req.session.username);

    if(typeof req.session.username == 'undefined'){
        res.redirect('/login');
        return;
    }

    next();
}, board);

var server = http.createServer(app).listen(process.env.PORT || port, function(){
    console.log('서버가 시작되었습니다. 포트 : ' + port);
})