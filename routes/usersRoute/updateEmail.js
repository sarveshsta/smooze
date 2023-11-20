var express = require('express');
var router = express.Router();
var indexmodel = require('../../models/UserApi');

//Update Email ROUTE
router.post('/', function (req, res, next) {
    const newemail = req.body.newemail

    indexmodel.updateEmail(req.body,newemail ,(result) => {
        if (result) {
            console.log('email updated successfully');
            res.send('email updated successfully');
        } else {
            console.log('Error while updating email');
        }
    });
});

module.exports = router;