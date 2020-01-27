var express=require('express');
var bodyParser=require('body-parser');
var app=express();

app.listen(3000, function () {
    console.log('start, express server')
})

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/main.html')
})

app.get('/main', function (req, res) {
    res.sendFile(__dirname + '/public/main.html')
})

app.get('/form.html', function (req, res) {
    res.sendFile(__dirname + '/public/form.html')
})

app.post('/email_post', function (req, res) {
    console.log(req.body.email)
    //res.send('post response');
    res.render('email.ejs', {'email': req.body.email})
})

app.post('/ajax_send_email', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");     //허용할 Origin(요청 url) : "*" 의 경우 모두 허용
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, DELETE, PUT");     //허용할 request http METHOD : POST, GET, DELETE, PUT
    res.setHeader("Access-Control-Max-Age", "3600");     //브라우저 캐시 시간(단위: 초) : "3600" 이면 최소 1시간 안에는 서버로 재요청 되지 않음
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");    //요청 허용 헤더(ajax : X-Requested-With)
    // (cf. 요청 허용 헤더 : "Origin,Accept,X-Requested-With,Content-Type,Access-Control-Request-Method,Access-Control-Request-Headers,Authorization")

    console.log(req.body.email);
})