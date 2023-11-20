var express = require('express');
var router = express.Router();
var indexmodel = require('../../models/UserApi');


//Update Bio
router.post('/', function (req, res, next) {
    const Bio = req.body.Bio
    indexmodel.EditProfileBio(req.body, Bio ,(result) => {
        if (result) {
            console.log('User Bio updated successfully');
            res.send('User Bio updated successfully');
        } else {
            console.log('Error while updating User Bio');
        }
    });
});

module.exports = router;