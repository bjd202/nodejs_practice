var mongoose = require('mongoose');
var aggregatePaginate = require('mongoose-aggregate-paginate-v2');
var moment = require('moment');

var Schema = new mongoose.Schema({
    username : {type : String},
    name : {type : String},
    title : {type : String},
    desc : {type : String},
    category : {type : String},
    start_dt : {type : Date},
    end_dt : {type : Date},
    create_at : {type : Date, default : Date.now()},
    update_at : {type : Date, default : Date.now()},
    accept_or_not : {type : String}
});

Schema.plugin(aggregatePaginate);

module.exports = mongoose.model('myapp_request', Schema);