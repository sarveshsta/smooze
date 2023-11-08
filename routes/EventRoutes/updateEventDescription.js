var express = require('express');
var router = express.Router();
var eventmodel = require('../../models/EventApi');

//update event description ROUTE
router.post('/', function (req, res, next) {
    const updateDescription = req.body.event_description
    eventmodel.updateEventDescription(req.body, updateDescription, (result) => {
        if (result) {
            console.log('event_description updated successfully');
            res.send('event_description updated successfully');
        } else {
            console.log('Error while updating event_description');
        }
    });
});

module.exports = router;