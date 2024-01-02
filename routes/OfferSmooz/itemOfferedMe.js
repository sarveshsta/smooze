// var express = require('express');
// var router = express.Router();
// var OfferModel = require('../../models/OfferSmooz');

// //Get CLUB VISITED ROUTE
// router.post('/', (req, res) => {
//     const option = req.body.option
//     OfferModel.itemOfferedMe(req.body,option, (result) => {
//         if (result) {
//             res.send({data  : result});
//             console.log(result);
//         } else {
//             res.status(500).render('error');
//         }
//     });
// });

// module.exports = router;
var express = require('express');
var router = express.Router();
var OfferModel = require('../../models/OfferSmooz');

// Get CLUB VISITED ROUTE
router.post('/', (req, res) => {
    const option = req.body.option;
    const timeoutDuration = 300000; // 5 minutes timeout

    OfferModel.itemOfferedMe(req.body, option, timeoutDuration, (result) => {
        if (result) {
            res.send({ data: result });
            console.log(result);
        } else {
            res.status(500).render('error');
        }
    });
});

module.exports = router;
