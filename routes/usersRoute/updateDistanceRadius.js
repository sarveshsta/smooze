var express = require('express');
var router = express.Router();
var indexmodel = require('../../models/UserApi');

//Update distance radius ROUTE
router.post('/', function (req, res, next) {
    const newDistanceRadius = req.body.DistanceRadius
    indexmodel.updateDistanceRadius(req.body,newDistanceRadius ,(result) => {
        if (result) {
            console.log('newDistanceRadius updated successfully');
            res.send('newDistanceRadius updated successfully');
        } else {
            console.log('Error while updating newDistanceRadius');
        }
    });
});

module.exports = router;