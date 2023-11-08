var express = require('express');
var router = express.Router();
var MenuModel = require('../../models/menuApi');


//get club menu details route
router.get('/', (req, res) => {
    MenuModel.getClubMenuDetails((data) => {
        if (data) {
            res.send({ data: data });
        } else {
            res.status(500).render('error');
        }
    });
});

module.exports = router;