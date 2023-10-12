// var express = require('express');
// var router = express.Router();
// var indexmodel = require('../models/indexmodel');

// //FORGOTPASSWORD ROUTE

// router.get('/', function (req, res, next) {
//     const Token = req.query.Token
//     const newPassword = req.body.Password
//     indexmodel.resetPassword(req.body,Token, newPassword,(result) => {
//         if (result) {
//             console.log('ResetPassword successfully');
//         } else {
//             console.log('Error while ResetPassword');
//         }
//     });
// });

// module.exports = router;

// resetPassword.js route file
var express = require('express');
var router = express.Router();
var indexmodel = require('../models/indexmodel');

// RESET PASSWORD ROUTE
router.get('/', function (req, res, next) {
    const Token = req.query.Token;
    const newPassword = req.query.Password; // Retrieve password from query parameters

    // Update the function call to pass the parameters correctly
    indexmodel.resetPassword(req.body, Token, newPassword, (result) => {
        if (result) {
            console.log('ResetPassword successfully');
            res.send('ResetPassword successfully'); // Send a response back to the client
        } else {
            console.log('Error while ResetPassword');
            res.status(400).send('Error while ResetPassword'); // Send an error response back to the client
        }
    });
});

module.exports = router;
