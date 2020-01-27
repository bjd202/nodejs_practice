var database;
var UserSchema;
var UserModel;

var init=function (db, schema, model) {
    console.log('call init');

    database=db;
    UserSchema=schema;
    UserModel=model;
}

var login=function (req, res) {
    console.log('call login in user module');
}

var adduser=function (req, res) {
    console.log('call adduser in user module');
}

var listuser=function (req, res) {
    console.log('call listuser in user module');
}

module.exports.init=init;
module.exports.login=login;
module.exports.adduser=adduser;
module.exports.listuser=listuser;