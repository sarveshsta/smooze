var express = require('express');
var router = express.Router();
var ClubVisitedModel = require('../../models/clubvisited');
var dem = require('../../utils/visitedClub');

//get CLUB VISITED ROUTE
router.get('/', (req, res) => {
    ClubVisitedModel.clubvisited((data) => {
        if (data) {
            res.send({ data: data });
            dem(data)
        } else {
            res.status(500).render('error');
        }
    });
});


module.exports = router;