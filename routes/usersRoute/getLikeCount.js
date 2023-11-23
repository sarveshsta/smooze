// route
var express = require('express');
var router = express.Router();
var indexmodel = require('../../models/UserApi');

router.get('/', (req, res) => {
    indexmodel.getLikeCount(req.body, (result) => {
        if (result && result.length > 0) {
            res.send({ data: result[0].mycount });
        } else {
            res.status(500).render('error');
        }
    });
});

module.exports = router;
