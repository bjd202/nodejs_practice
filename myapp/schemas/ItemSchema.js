var mongoose = require('mongoose');
var aggregatePaginate = require('mongoose-aggregate-paginate-v2');

var Schema = new mongoose.Schema({
    name : {type : String},
    category : {type : String},
    number : {type : Number, default : 0},
    desc : {type : String, default : ''},
    author : {type : String},
    files : [{
        filename : {type : String, default : ''},
        originalname : {type : String, defulat : ''},
        path : {type : String, defulat : ''},
        size : {type : Number, default : 0},
        mimetype : {type : String, default : ''}
    }],
    create_at : {type : Date, default : new Date()},
    update_at : {type : Date, default : new Date()}
});

Schema.plugin(aggregatePaginate);

module.exports = mongoose.model('myapp_item', Schema);