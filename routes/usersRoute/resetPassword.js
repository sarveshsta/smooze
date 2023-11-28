var express = require('express');
var router = express.Router();
var indexmodel = require('../../models/UserApi');

//resetPASSWORD ROUTE
router.get('/', function (req, res, next) {
    const Token = req.query.Token
    const newPassword = req.body.Password
    indexmodel.resetPassword(Token, newPassword, req.body, (result) => {
        if (result) {
            console.log('ResetPassword successfully');
            res.send('ResetPassword successfully');
        } else {
            console.log('Error while ResetPassword');
            res.status(400).send('Error while ResetPassword');
        }
    });
});


module.exports = router;