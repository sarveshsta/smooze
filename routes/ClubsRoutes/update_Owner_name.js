var express = require('express');
var router = express.Router();
var clubmodel = require('../../models/clubAPI');


//update Club_name route
router.post('/', function (req, res) {
    const Owner_name = req.body.Owner_name
    clubmodel.update_Owner_name(req.body,Owner_name,(result) => {
        if (result) {
            console.log('Owner_name updated successfully');
            res.send('Owner_name updated successfully');
        } else {
            console.log('Error while updating Name');
        }
    });
});

module.exports = router;