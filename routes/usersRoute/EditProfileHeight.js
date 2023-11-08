var express = require('express');
var router = express.Router();
var indexmodel = require('../../models/allApis');


//Update Height
router.post('/', function (req, res, next) {
    const Height = req.body.Height
    indexmodel.EditProfileHeight(req.body, Height ,(result) => {
        if (result) {
            console.log('User Height updated successfully');
            res.send('User Height updated successfully');
        } else {
            console.log('Error while updating User Height');
        }
    });
});

module.exports = router;