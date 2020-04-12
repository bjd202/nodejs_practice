var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
    username : {type : String},
    password : {type : String},
    email : {type : String},
    salt : {type : String},
    create_at : {type : Date, default : Date.now}
});

module.exports = mongoose.model('myapp_user', Schema);