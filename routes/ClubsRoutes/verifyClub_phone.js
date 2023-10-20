var express = require('express');
var router = express.Router();
var clubmodel = require('../../models/clubAPI');

//LOGIN With OTP ROUTE

router.post('/', (req, res, next) => {
    const OTP = req.body.otp
    clubmodel.verifyClub_phone(req.body, OTP,(results) => {
        console.log(results);
        if(results){
            res.send("otp matched");
        }
        else{
            res.send("otp miss matched");
        }
    });
});
module.exports = router;