var express = require('express')
var router = express.Router();
var multer = require('multer')
var moment = require('moment');
var fs = require('fs')

var upload = multer({
    dest : "upload/contract/"
})

var ContractSchema = require('../schemas/ContractSchema')

router.get('/list/:page', function (req, res) {
    console.log('get contract list');

    var page = req.params.page;

    var options = {
        page : page,
        limit : 10,
        sort : {create_at : -1}
    }

    var aggregate = ContractSchema.aggregate();
    ContractSchema.aggregatePaginate(aggregate, options, function (err, results) {
        if(err){
            console.error(err);
            return;
        }

        if(results){
            console.log(results);
            res.render('contract_list', {contract : results});
        }else{
            console.log('데이터 없음');
        }
    })
})

router.get('/create', function (req, res) {
    console.log('get contract create')

    res.render('contract_create')
})

router.post('/create', upload.array("file"), function (req, res) {
    console.log('post contract create')

    console.dir(req.body);

    var name = req.body.name;
    var category = req.body.category;
    var company = req.body.company;
    var company_number = req.body.company_number;
    var company_location = req.body.company_location;
    var desc = req.body.desc;
    var author = req.session.username;
    var contract_dt = req.body.contract_dt;
    var contract_start_dt = req.body.contract_start_dt;
    var contract_end_dt = req.body.contract_end_dt;
    var files = req.files;
    var employee_rank = req.body.employee_rank;
    var employee_name = req.body.employee_name;
    var employee_number = req.body.employee_number;
    
    var contract = new ContractSchema();

    contract.name = name;
    contract.category = category;
    contract.company = company;
    contract.company_number = company_number;
    contract.company_location = company_location;
    contract.desc = desc;
    contract.author = author;
    contract.contract_dt = contract_dt;
    contract.contract_start_dt = contract_start_dt;
    contract.contract_end_dt = contract_end_dt;

    if(typeof files != 'undefined'){
        for(var i=0; i<files.length; i++){
            var obj = {};

            obj.filename = files[i].filename;
            obj.originalname = files[i].originalname;
            obj.path = files[i].path;
            obj.size = files[i].size;
            obj.mimetype = files[i].mimetype;

            contract.files.push(obj);
        }
    }

    for (let i = 0; i < employee_rank.length; i++) {
        var obj = {};

        obj.employee_name = employee_name[i];
        obj.employee_number = employee_number[i];
        obj.employee_rank = employee_rank[i];

        contract.company_employees.push(obj);
    }

    contract.save(function (err) {
        if(err){
            console.error(err);
            res.json({result : 0});
            return;
        }
    })

    res.json({result : 1});
})

router.get('/detail/:id', function (req, res) {
    console.log('get contract detail');

    var id = req.params.id;

    ContractSchema.findById(id, function (err, result) {
        if(err){
            console.error(err);
            return;
        }

        if(result){
            res.render('contract_detail', {contract : result, moment : moment});
        }else{
            console.log('데이터 없음');
        }
    })
})

module.exports = router;