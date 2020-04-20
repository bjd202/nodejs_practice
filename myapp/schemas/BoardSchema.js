var mongoose = require('mongoose');
var aggregatePaginate = require('mongoose-aggregate-paginate-v2');

var Schema = new mongoose.Schema({
    title : {type : String},
    content : {type : String},
    view : {type : Number, default : 0},
    author : {type : String},
    create_at : {type : Date, default : Date.now},
    update_at : {type : Date, default : Date.now}
});

Schema.plugin(aggregatePaginate);

module.exports = mongoose.model('myapp_board', Schema);