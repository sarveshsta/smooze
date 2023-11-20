var express = require('express');
var router = express.Router();
var indexmodel = require('../../models/UserApi');


//Update work
router.post('/', function (req, res, next) {
    const Work = req.body.Work
    indexmodel.EditProfileWork(req.body, Work,(result) => {
        if (result) {
            console.log('User Work updated successfully');
            res.send('User Work updated successfully');
        } else {
            console.log('Error while updating User Work');
        }
    });
});

module.exports = router;