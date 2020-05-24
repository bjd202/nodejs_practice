var mongoose = require('mongoose');
var aggregatePaginate = require('mongoose-aggregate-paginate-v2');
var moment = require('moment');

var Schema = new mongoose.Schema({
    name : {type : String},
    username : {type : String},
    password : {type : String},
    email : {type : String},
    salt : {type : String},
    create_at : {type : Date, default : Date.now()},
    punch_in_out : [{
        category : {type : String},
        time : {type : String}
    }]
});

Schema.plugin(aggregatePaginate);

module.exports = mongoose.model('myapp_user', Schema);