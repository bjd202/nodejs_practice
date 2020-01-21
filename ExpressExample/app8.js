var express=require('express')
, http=require('http')
, path=require('path');

var bodyParser=require('body-parser')
, static=require('serve-static');

var app=express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

var router=express.Router();

router.route('/process/login').post( function (req, res) {
    console.log('첫 번째 미들웨어에서 요청 처리');

    var paramId=req.body.id || req.query.id;
    var paramPassword=req.body.password || req.query.password;

    res.writeHead('200', {'Content-Type':'text/html; charset=utf8'});
    res.write('<h1>Express 서버에서 응답한 결과</h1>');
    res.write('<div><p>Param id : ' + paramId + '</p></div>');
    res.write('<div><p>Param password : ' + paramPassword + '</p></div>');
    res.end();
});

app.use('/', router);

http.createServer(app).listen(3000, function () {
    console.log('Express 서버가 3000번 포트에서 시작 됨.');
});