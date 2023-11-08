var express = require('express');
var router = express.Router();
var indexmodel = require('../../models/allApis');

//verify OTP ROUTE
router.post('/', (req, res, next) => {
    const otp = req.body.otp
    indexmodel.VerifyOTP(req.body, otp,(results) => {
        console.log(results);
        if(results){
            res.send("users login");
        }
        else{
            res.send("otp miss matched");
        }
    });
});
module.exports = router;