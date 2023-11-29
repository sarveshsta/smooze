var express = require('express');
var router = express.Router();
var ChattingModel = require('../../models/chattingApi');


//allSentMessages route
router.get('/', (req, res) => {
    ChattingModel.allSentMessages((data) => {
        if (data) {
            console.log({data : data});
            res.send({ data: data });
        } else {
            res.status(500).render('error');
        }
    });
});

module.exports = router;