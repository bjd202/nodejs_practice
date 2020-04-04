var add = function (req, res) {
    console.log('coffeeshop 모듈 안에 있는 add 호출됨.');

    var paramName = req.body.name || req.query.name;
    var paramAddress = req.body.address || req.query.address;
    var paramTel = req.body.tel || req.query.tel;
    var paramLongitue = req.body.longitude || req.query.longitude;
    var paramLatitude = req.body.latitude || req.query.latitude;

    console.log('요청 파라미터 : ' + paramName + ', ' + paramAddress + ', ' + paramTel + ', ' +paramLongitue + ', ' + paramLatitude);

    // 데이터베이스 객체 참조
    var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
    if(database.db){
        addCoffeeShop(database, paramName, paramAddress, paramTel, paramLongitue, paramLatitude, function (err, result) {
            if(err){
                console.error('커피숍 추가 중 오류 발생 : ' + err.stack);

                res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
                res.write('<h2>커피숍 추가 중 오류 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                return;
            }

            if(result){
                console.dir(result);

                res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
                res.write('<h2>커피숍 추가 성공</h2>');
                res.end();
            }else{
                res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
                res.write('<h2>커피숍 추가 실패</h2>');
                res.end();
            }
        });
    }else{
        res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }
}

// 커피숍을 추가하는 함수
var addCoffeeShop = function (database, name, address, tel, longitude, latitude, callback) {
    console.log('addCoffeeShop 호출딤.');

    // CoffeeShopModel
    var coffeeshop = new database.CoffeeShopModel(
        {name : name, address : address, tel : tel,
            geometry : {
                type : 'Point',
                coordinates : [longitude, latitude]
            }
        }
    );

    // save()로 저장
    coffeeshop.save(function (err) {
        if(err){
            callback(err, null);
            return;
        }

        console.log('커피숍 데이터 추가함');
        callback(null, coffeeshop);
    })
}

var list = function (req, res) {
    console.log('coffeeshop 모듈 안에 있는 list 호출됨.');

    // 데이터베이스 객체 참조
    var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
    if(database.db){
        // 1. 모든 커피숍 검색
        database.CoffeeShopModel.findAll(function (err, results) {
            if(err){
                console.error('커피숍 리스트 조회 중 오류 발생 : ' + err.stack);

                res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
                res.write('<h2>커피숍 리스트 조회 중 오류 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                return;
            }

            if(results){
                console.dir(results);
                res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
                res.write('<h2>커피숍 리스트</h2>');
                res.write('<div><ul>');
                
                for(var i=0; i<results.length; i++){
                    var curName = results[i]._doc.name;
                    var curAddress = results[i]._doc.address;
                    var curTel = results[i]._doc.tel;
                    var curLongitude = results[i]._doc.geometry.coordinates[0];
                    var curLatitude = results[i]._doc.geometry.coordinates[1];

                    res.write('    <li>#' + i + ' : ' + curName + ', ' + curAddress + ', ' + curTel + ', ' + curLongitude + ', ' + curLatitude + '</li>');
                }
                res.write('</ul></div>');
                res.end();
            }else{
                res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
                res.write('<h2>커피숍 리스트 조회 실패</h2>');
                res.end();
            }
        });
    }else{
        res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }
}

var findNear = function (req, res) {
    console.log('coffeeshop 모듈 안에 있는 findNear 호출됨.');

    var maxDistance = 1000;

    var paramLongitue = req.body.longitude || req.query.longitude;
    var paramLatitude = req.body.latitude || req.query.latitude;

    console.log('요청 파라미터 : ' + paramLongitue + ', ' + paramLatitude);

    // 데이터베이스 객체 참조
    var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
    if(database.db){
        // 1. 가까운 커피숍 검색
        database.CoffeeShopModel.findNear(paramLongitue, paramLatitude, maxDistance, function (err, results) {
            if(err){
                console.error('커피숍 검색 중 오류 발생 : ' + err.stack);

                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>커피숍 검색 중 오류 발생</h2>');
                res.write('<p>' + err.stack + '<p>');
                res.end();

                return;
            }

            if(results){
                console.dir(results);

                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>가까운 커피숍</h2>');
                res.write('<div><ul>');

                for(var i=0; i<results.length; i++){
                    var curName = results[i]._doc.name;
                    var curAddress = results[i]._doc.address;
                    var curTel = results[i]._doc.tel;
                    var curLongitude = results[i]._doc.geometry.coordinates[0];
                    var curLatitude = results[i]._doc.geometry.coordinates[1];

                    res.write('     <li>#' + i + ' : ' + curName + ', ' + curAddress + ', ' + curTel
                     + ', ' + curLongitude + ', ' + curLatitude + '</li>');
                }

                res.wirte('</ul></div>');
                res.end();
            }
        })
    }else{
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }
}

var findWithin = function (req, res) {
    console.log('coffeeshop 모듈 안에 있는 findWithin 호출됨.');

    var paramTopLeftLongitude = req.body.topleft_longitude || req.query.topleft_longitude;
    var paramTopLeftLatitude = req.body.topleft_latitude || req.query.topleft_latitude;
    var paramBottomRightLongitude = req.body.bottomright_longitude || req.query.bottomright_longitude;
    var paramBottomRightLatitude = req.body.bottomright_latitude || req.query.bottomright_latitude;

    console.log('요청 파라미터 : ' + paramTopLeftLongitude + ', ' + paramTopLeftLatitude + ', ' +
        paramBottomRightLongitude + ', ' + paramBottomRightLatitude);

    // 데이터베이스 객체 참조
    var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
    if(database.db){
        // 1. 가까운 커피숍 검색
        database.CoffeeShopModel.findWithin(paramTopLeftLongitude, paramTopLeftLatitude,
            paramBottomRightLongitude, paramBottomRightLatitude, function (err, results) {
                if(err){
                    console.error('커피숍 검색 중 오류 발생 : ' + err.stack);

                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    res.write('<h2>커피숍 검색 중 오류 발생</h2>');
                    res.write('<p>' + err.stack + '</p>');
                    res.end();

                    return;
                }
            })
    }
}

var findCircle = function (req, res) {
    console.log('coffeeshop 모듈 안에 있는 findCircle 호출됨.');

    var paramCenterLongitude = req.body.center_longitude || req.query.center_longitude;
    var paramCenterLatidue = req.body.center_latitude || req.query.center_latitude;
    var paramRadius = req.body.radius || req.query.radius;

    console.log('요청 파라미터 : ' + paramCenterLongitude + ', ' + paramCenterLatidue + ', ' + paramRadius);

    // 데이터베이스 객체 참조
    var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
    if(database.db){
        // 1. 가까운 커피숍 검색
        database.CoffeeShopModel.findCircle(paramCenterLongitude, paramCenterLatidue, paramRadius, function (err, results) {
            if(err){
                console.error('커피숍 검색 중 오류 발생 : ' + err.stack);

                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>커피숍 검색 중 오류 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();

                return;
            }
        })
    }
}

module.exports.add = add;
module.exports.list = list;
module.exports.findNear = findNear;
module.exports.findWithin = findWithin;
module.exports.findCircle = findCircle;