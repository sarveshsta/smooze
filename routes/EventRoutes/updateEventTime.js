var express = require('express');
var router = express.Router();
var eventmodel = require('../../models/EventApi');

//update event time ROUTE
router.post('/', function (req, res, next) {
    const updateTime = req.body.time
    eventmodel.updateEventTime(req.body, updateTime, (result) => {
        if (result) {
            console.log('new Time updated successfully');
            res.send('new Time updated successfully');
        } else {
            console.log('Error while updating new Time');
        }
    });
});

module.exports = router;