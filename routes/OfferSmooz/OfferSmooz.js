var express = require('express');
var router = express.Router();
var OfferModel = require('../../models/OfferSmooz');
var dem = require('../../utils/visitedClub');

//Get CLUB VISITED ROUTE
router.get('/', (req, res) => {
    OfferModel.OfferSmooz((result) => {
        if (result) {
            res.send({ data:result });
            console.log("They Can Offer Smooz");
            dem(result)
        } else {
            res.status(500).render('error');
        }
    });
});

module.exports = router;