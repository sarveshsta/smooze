var express = require('express');
var router = express.Router();
var indexmodel = require('../../models/allApis');

//update name ROUTE
router.post('/', function (req, res, next) {
    const newMinAge = req.body.min_age
    const newMaxAge = req.body.max_age
    if (newMinAge > 18 && newMinAge < 100) {
        indexmodel.update_Min_Max_Age(req.body, newMinAge, newMaxAge, (result) => {
            if (result) {
                console.log('Min and Max Age updated successfully');
                res.send('Min and Max Age updated successfully');
            } else {
                console.log('Error while updating Min and Max Age');
            }
        });
    }
    else {
        res.send("your given the wrong min_age or max_age");
        console.log("your given the wrong min_age or max_age");
    }

});

module.exports = router;