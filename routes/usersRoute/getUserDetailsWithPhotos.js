var express = require('express');
var router = express.Router();
var indexmodel = require('../../models/allApis');

router.get('/', (req, res) => {
    indexmodel.getUserDetailsWithPhotos((data) => {
        if (data) {
            res.send({ data: data });
        } else {
            res.status(500).render('error');
        }
    });
});

module.exports = router;