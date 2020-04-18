var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
    title : {type : String},
    content : {type : String},
    create_at : {type : Date, default : Date.now},
    update_at : {type : Date, default : Date.now}
});

module.exports = mongoose.model('myapp_board', Schema);