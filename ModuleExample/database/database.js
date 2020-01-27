var mongoose=require('mongoose');

var database={};

database.init=function (app, config) {
    console.log('call init()');

    connect(app, config);
}

function connect(app, config) {
    console.log('call connect()');
}

function createSchema(app, config) {
    var schemaLen=config.db_schemas.length;
    console.log('schema number : %d', schemaLen);

    for (let i = 0; i < schemaLen; i++) {
        var curItem=config.db_schemas[i];
        
        var curSchema=require(curItem.file).createSchema(mongoose);
        console.log('%s 모듈을 불러들인 후 스키마 정의', curItem.file);

        var curModel=mongoose.model(curItem.collection, curSchema);
        console.log('%s 컬렉션을 위해 모델 정의', curItem.collection);

        database[curItem.schemaName]=curSchema;
        database[curItem.modelName]=curModel;
        console.log('스키마 이름 %s, 모델이름 %s이 database 객체의 속성으로 추가도미.', curItem.schemaName, curItem.modelName);
    }

    app.set('database', database);
    console.log('database 객체가 app 객체의 속성으로 추가됨');
}

module.exports=database;