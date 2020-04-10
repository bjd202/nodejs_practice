var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
    username : {type : String},
    password : {type : String},
    create_at : {type : Date, default : Date.now}
});

console.log('UserSchema 생성');

module.exports = mongoose.model('myapp_user', Schema);