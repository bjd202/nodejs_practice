var mongoose = require('mongoose');
var aggregatePaginate = require('mongoose-aggregate-paginate-v2');

var Schema = new mongoose.Schema({
    username : {type : String},
    password : {type : String},
    email : {type : String},
    salt : {type : String},
    create_at : {type : Date, default : new Date()}
});

Schema.plugin(aggregatePaginate);

module.exports = mongoose.model('myapp_user', Schema);