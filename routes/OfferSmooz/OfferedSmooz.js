var express = require('express');
var router = express.Router();
var OfferModel = require('../../models/OfferSmooz');

//Get CLUB VISITED ROUTE
router.post('/', (req, res) => {

    function calculateTotalPrice(items) {
        let totalPrice = 0;

        for (const item of items) {
            totalPrice += item.price;
        }

        return totalPrice;
    }

    const totalItemPrice = calculateTotalPrice(req.body.itemOffered);

    const TotalPrice = totalItemPrice;

    const itemOffered = req.body.itemOffered;

    OfferModel.OfferedSmooz(req.body, TotalPrice,itemOffered, (result) => {
        if (result) {
            res.send("offered Smooz")
            console.log("Offered Smooz");
        } else {
            res.status(500).render('error');
        }
    });
});

module.exports = router;
