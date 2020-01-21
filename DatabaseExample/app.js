var express=require('express')
, http=require('http')
, path=require('path');

var bodyParser=require('body-parser')
, cookieParser=require('cookie-parser')
, static=require('serve-static')
, errorHandler=require('errorhandler');

var expressErrorHandler=require('express-error-handler');

var expressSession=require('express-session');

var MongoClient=require('mongodb').MongoClient;

var database;

var mongoose=require('mongoose');

var UserSchmea;

var UserModel;

function connectDB() {
    var databaseUrl='mongodb://localhost:27017/local';

    // MongoClient.connect(databaseUrl, function (err, db) {
    //     if(err) throw err;

    //     console.log('db connect. : ' + databaseUrl);

    //     database=db.db('local');
    // })

    console.log('db connecting...');
    mongoose.Promise=global.Promise;
    mongoose.connect(databaseUrl);
    database=mongoose.connection;

    database.on('error', console.error.bind(console, 'mongoose connection error'));
    database.on('open', function () {
        console.log('db connect : ' + databaseUrl);
    });

    UserSchmea=mongoose.Schema({
        id: String,
        name: String,
        password: String
    });

    UserModel=mongoose.model('users', UserSchmea);

    database.on('disconnected', function () {
        console.log('db disconnect. reconnect after 5sec');
        setInterval(connectDB, 5000);
    });
}

var app=express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.use('/public', static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));

var router=express.Router();

app.post('/process/login', function (req, res) {
    console.log('/process/login');

    var paramId=req.body.id || req.query.id;
    var paramPassword=req.body.password || req.query.password;

    if(database){
        authUser(database, paramId, paramPassword, function (err, docs) {
            if(err) throw err;

            if(docs){
                console.dir(docs);
                var username=docs[0].name;
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>로그인 성공</h1>');
                res.write('<div><p>id : ' + paramId + '</p></div>');
                res.write('<div><p>password : ' + paramPassword + '</p></div>');
                res.write("<br><br><a href='/public/login.html>re login</a>");
                res.end();
            }else{
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>login fail</h1>');
                res.write('<div><p>please id and password check</p></div>');
                res.write("<br><br><a href='/public/login.html'>re login</a>");
                res.end();
            }
        });
    }else{
        res.write('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>database connect fail</h2>');
        res.end();
    }
});

router.route('/process/adduser').post(function (req, res) {
    console.log('/process/adduser call');

    var paramId=req.body.id || req.query.id;
    var paramPassword=req.body.password || req.query.password;
    var paramName=req.body.name || req.query.name;

    if(database){
        addUser(database, paramId, paramPassword, paramName, function (err, result) {
            if(err) throw err;

            console.dir(result);

            if(result && result.insertedCount > 0){
                console.dir(result);

                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>success add</h2>');
                res.end();
            }else{
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>fail add</h2>');
                res.end();
            }
        });
    }else{
        res.write('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>database connect fail</h2>');
        res.end();
    }
})

app.use('/', router);

var errorHandler=expressErrorHandler({
    static: {
        '404':'./DatabaseExample/public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

http.createServer(app).listen(app.get('port'), function () {
    console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));

    connectDB();
});

var authUser=function (database, id, password, callback) {
    console.log('authUser call');

    //var users=database.collection('users');

    // users.find({"id": id, "password": password}).toArray(function (err, docs) {
    //     if(err){
    //         callback(err, null);
    //         return;
    //     }

    //     if(docs.length > 0){
    //         console.log('id : %s, password : %s', id, password);
    //         callback(null, docs);
    //     }else{
    //         console.log('not found');
    //         callback(null, null);
    //     }
    // });

    UserModel.find({"id": id, "password": password}, function (err, results) {
        if(err){
            callback(err, null);
            return;
        }

        console.dir(results);

        if(results.length > 0){
            console.log('id : %s, password : %s', id, password);
            callback(null, results);
        }else{
            console.log('not found');
            callback(null, null);
        }
    });
}

var addUser=function (database, id, password, name, callback) {
    console.log('adduser call');

    // var users=database.collection('users');

    // users.insertMany([{"id": id, "password": password, "name": name}], function (err, result) {
    //     if(err){
    //         callback(err, null);
    //         return;
    //     }

    //     if(result.insertedCount > 0){
    //         console.log('success add');
    //     }else{
    //         console.log('fail add');
    //     }

    //     callback(null, result);
    // });

    var user=new UserModel({"id": id, "password": password, "name": name});

    user.save(function (err) {
        if(err){
            callback(err, null);
            return;
        }

        console.log('success add');
        callback(null, user);
    })
}