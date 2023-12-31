var express = require('express');
var router = express.Router();
var indexmodel = require('../../models/UserApi');

//FORGOTPASSWORD ROUTE
router.post('/', function (req, res, next) {
    indexmodel.forgotPassword(req.body, (result) => {
        // console.log('Result:', result);
        if (result) {
            console.log('Mail sent successfully');
            res.send('Mail sent successfully');
        } else {
            console.log('Error while sending mail');
        }
    });
});

module.exports = router;