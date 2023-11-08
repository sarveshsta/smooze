var express = require('express');
var router = express.Router();
var indexmodel = require('../../models/allApis');

//resetPASSWORD ROUTE
router.get('/', function (req, res, next) {
    const Token = req.query.Token
    const newPassword = req.body.Password
    indexmodel.resetPassword(req.body,Token, newPassword,(result) => {
        if (result) {
            console.log('ResetPassword successfully');
            res.send('ResetPassword successfully');
        } else {
            console.log('Error while ResetPassword');
        }
    });
});

module.exports = router;