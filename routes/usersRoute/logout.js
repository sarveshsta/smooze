var express = require('express');
var router = express.Router();
var indexmodel = require('../../models/UserApi');

//LOGOUT ROUTE 
router.post('/', (req, res, next) => {
    //ALL COOKIES REMOVED
    res.setHeader('Set-Cookie', [
        'isLoggedin = false; HttpOnly; Secure',
        'Expires = Expired; HttpOnly; Secure'
    ]);
    console.log('You are logged out');
});

module.exports = router;
