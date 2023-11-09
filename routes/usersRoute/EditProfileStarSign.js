var express = require('express');
var router = express.Router();
var indexmodel = require('../../models/allApis');


//Update Language
router.post('/', function (req, res, next) {
    const newStarSign = req.body.StarSign
    indexmodel.EditProfileStarSign(req.body, newStarSign ,(result) => {
        if (result) {
            console.log('User newStarSign updated successfully');
            res.send('User newStarSign updated successfully');
        } else {
            console.log('Error while updating User newStarSign');
        }
    });
});

module.exports = router;