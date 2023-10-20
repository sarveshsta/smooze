var express = require('express');
var router = express.Router();
var clubmodel = require('../../models/clubAPI');

//FORGOTPASSWORD ROUTE

router.post('/', function (req, res, next) {
    const newemail = req.body.newemail

    clubmodel.updateClub_Email(req.body,newemail ,(result) => {
        if (result) {
            console.log('clubs email updated successfully');
            res.send('clubs email updated successfully');
        } else {
            console.log('Error while updating email');
        }
    });
});

module.exports = router;