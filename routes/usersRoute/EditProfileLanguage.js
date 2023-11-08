var express = require('express');
var router = express.Router();
var indexmodel = require('../../models/allApis');


//Update Language
router.post('/', function (req, res, next) {
    const Language = req.body.Language
    indexmodel.EditProfileLanguage(req.body, Language ,(result) => {
        if (result) {
            console.log('User Language updated successfully');
            res.send('User Language updated successfully');
        } else {
            console.log('Error while updating User Lamguage');
        }
    });
});

module.exports = router;