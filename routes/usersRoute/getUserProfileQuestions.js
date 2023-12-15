var express = require('express');
var router = express.Router();
var indexmodel = require('../../models/UserApi');


//getUserDetailsWithProfileQuestions
router.get('/', (req, res) => {
    indexmodel.getUserProfileQuestions((data) => {
        if (data) {
            res.send({ data: data });
        } else {
            res.status(500).render('error');
        }
    });
});

module.exports = router;