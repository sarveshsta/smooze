var express = require('express');
var router = express.Router();
var indexmodel = require('../../models/UserApi');

//update phone ROUTE
router.post('/', function (req, res, next) {
    const phone = req.body.phone

    indexmodel.updatePhone(req.body,phone,(result) => {
        if (result) {
            console.log('phone updated successfully');
            res.send('phone updated successfully');
        } else {
            console.log('Error while updating phone');
        }
    });
});

module.exports = router;