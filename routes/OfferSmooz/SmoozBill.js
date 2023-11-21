var express = require('express');
var router = express.Router();
var OfferModel = require('../../models/OfferSmooz');

//Get CLUB VISITED ROUTE
router.get('/', (req, res) => {
    OfferModel.SmoozBill(req.body, (result) => {
        if (result) {
            res.send({data  : result});
            console.log(result);
        } else {
            res.status(500).render('error');
        }
    });
});

module.exports = router;