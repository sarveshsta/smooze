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

    indexmodel.deactivateUser(req.body, (result) => {
        if (result) {
            console.log('You are logged out');
            res.send('You are logged out');        
        } else {
          console.log('Failed to logout user.');
        }
    })
    
});

module.exports = router;
