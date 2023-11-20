var express = require('express');
var router = express.Router();
var indexmodel = require('../../models/UserApi');

//update Location ROUTE
router.post('/', function (req, res, next) {
    const newLocation = req.body.location
    indexmodel.updateLocation(req.body,newLocation ,(result) => {
        if (result) {
            console.log('Location updated successfully');
            res.send('Location updated successfully');
        } else {
            console.log('Error while updating Location');
        }
    });
});

module.exports = router;