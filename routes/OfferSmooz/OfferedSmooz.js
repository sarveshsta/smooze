var express = require('express');
var router = express.Router();
var OfferModel = require('../../models/OfferSmooz');
var dem = require('../../utils/visitedClub');

//Get CLUB VISITED ROUTE
router.post('/', (req, res) => {
    OfferModel.OfferedSmooz(req.body,(result) => {
        if (result) {
            res.send("offered Smooz")
            console.log("Offered Smooz")
        } else {
            res.status(500).render('error');
        }
    });
});

module.exports = router;