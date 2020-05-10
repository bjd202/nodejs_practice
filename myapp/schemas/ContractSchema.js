var mongoose = require('mongoose');
var aggregatePaginate = require('mongoose-aggregate-paginate-v2');
var moment = require('moment');

var Schema = new mongoose.Schema({
    name : {type : String},
    category : {type : String},
    company : {type : String},
    company_number : {type : String, default : ''},
    company_location : {type : String, default : ''},
    company_employees : [{
        employee_name : {type : String, default : ''},
        employee_number : {type : String, default : ''},
        employee_rank : {type : String, default : ''}
    }],
    desc : {type : String, default : ''},
    author : {type : String},
    files : [{
        filename : {type : String, default : ''},
        originalname : {type : String, defulat : ''},
        path : {type : String, defulat : ''},
        size : {type : Number, default : 0},
        mimetype : {type : String, default : ''}
    }],
    create_at : {type : Date, default : Date.now()},
    update_at : {type : Date, default : Date.now()},
    contract_dt : {type : Date},
    contract_start_dt : {type : Date},
    contract_end_dt : {type : Date}
});



Schema.plugin(aggregatePaginate);

module.exports = mongoose.model('myapp_contract', Schema);