var express = require('express');
var router = express.Router();
var OfferModel = require('../../models/OfferSmooz');
var dem = require('../../utils/visitedClub');

//get CLUB VISITED ROUTE
router.post('/', (req, res) => {
    OfferModel.OfferSmooz(req.body, (result) => {
        if (result) {
            res.send({ data:result });
            console.log("They Can Offer Smooz")
            dem(result)
        } else {
            res.status(500).render('error');
        }
    });
});

module.exports = router;