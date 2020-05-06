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

module.exports = router;