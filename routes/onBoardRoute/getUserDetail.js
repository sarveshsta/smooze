var express = require('express');
var router = express.Router();
var onboardModel = require('../../models/onBoardingApi');


//get user detail route
router.get('/', (req, res) => {
    onboardModel.getUserDetails((data) => {
        if (data) {
            res.send({ data: data });
        } else {
            res.status(500).render('error');
        }
    });
});

module.exports = router;