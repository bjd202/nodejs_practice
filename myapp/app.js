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

var index = require('./router/index');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({extended : false}));

// 라우터
app.use(index);

var server = http.createServer(app).listen(process.env.PORT || port, function(){
    console.log('서버가 시작되었습니다. 포트 : ' + port);
})