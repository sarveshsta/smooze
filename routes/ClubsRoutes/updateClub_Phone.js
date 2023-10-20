var express = require('express');
var router = express.Router();
var clubmodel = require('../../models/clubAPI');

//FORGOTPASSWORD ROUTE

router.post('/', function (req, res, next) {
    const phone = req.body.Phone

    clubmodel.update_Club_Phone(req.body,phone,(result) => {
        if (result) {
            console.log('phone updated successfully');
            res.send('phone updated successfully');
        } else {
            console.log('Error while updating phone');
        }
    });
});

module.exports = router;