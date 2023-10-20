var express = require('express');
var router = express.Router();
var clubmodel = require('../../models/clubAPI');


//update Club_name route

router.post('/', function (req, res) {
    const Clubnewname = req.body.Club_name

    clubmodel.update_Club_name(req.body,Clubnewname,(result) => {
        if (result) {
            console.log('Club_Name updated successfully');
            res.send('Club_Name updated successfully');
        } else {
            console.log('Error while updating Name');
        }
    });
});

module.exports = router;