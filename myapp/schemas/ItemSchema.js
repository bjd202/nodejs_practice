var mongoose = require('mongoose');
var aggregatePaginate = require('mongoose-aggregate-paginate-v2');

var history = new mongoose.Schema({
    date : {type : Date},
    category : {type : String, default : ''},
    number : {type : Number, default : 0},
    desc : {type : String, default : ''}
})

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
    update_at : {type : Date, default : new Date()},
    history : {type : [history]}
});



Schema.plugin(aggregatePaginate);

module.exports = mongoose.model('myapp_item', Schema);