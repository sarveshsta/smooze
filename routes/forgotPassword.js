var express = require('express');
var router = express.Router();
var indexmodel = require('../models/indexmodel');

//regsitration route
router.post('/', function (req, res, next) {
    indexmodel.forgotPassword(req.body, (result) => {
        console.log('Result:', result);
        if (result) {
            console.log('Mail sent successfully');
        } else {
            console.log('Error while sending mail');
        }
    });
});

module.exports = router;