var express = require('express');
var router = express.Router();
var eventmodel = require('../../models/EventApi');

router.get('/', (req, res) => {
    eventmodel.getClubEvents((data) => {
        if (data) {
            res.send({ data: data });
        } else {
            res.status(500).render('error');
        }
    });
});

module.exports = router;