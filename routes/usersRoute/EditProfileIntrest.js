var express = require('express');
var router = express.Router();
var indexmodel = require('../../models/allApis');


//Update Intrest
router.post('/', function (req, res, next) {
    const Intrest = req.body.Intrest
    indexmodel.EditProfileIntrest(req.body, Intrest ,(result) => {
        if (result) {
            console.log('User Intrest updated successfully');
            res.send('User Intrest updated successfully');
        } else {
            console.log('Error while updating User Intrest');
        }
    });
});

module.exports = router;