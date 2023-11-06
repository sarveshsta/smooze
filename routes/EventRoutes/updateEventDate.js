var express = require('express');
var router = express.Router();
var eventmodel = require('../../models/EventApi');

//FORGOTPASSWORD ROUTE

router.post('/', function (req, res, next) {
    const updateDate = req.body.date
    eventmodel.updateEventDate(req.body, updateDate, (result) => {
        if (result) {
            console.log('new date updated successfully');
            res.send('new date updated successfully');
        } else {
            console.log('Error while updating new Date');
        }
    });
});

module.exports = router;