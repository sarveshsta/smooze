var express = require('express');
var router = express.Router();
var onboardModel = require('../../models/onBoardingApi');

//update onboarding question ROUTE
router.post('/', function (req, res, next) {
    const OptedOption = req.body.options
    onboardModel.updateonboarding(req.body, OptedOption,(result) => {
        if (result) {
            console.log('questions updated successfully');
            res.send('question updated successfully');
        } else {
            console.log('Error while updating menu');
        }
    });
});

module.exports = router;

