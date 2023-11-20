var express = require('express');
var router = express.Router();
var indexmodel = require('../../models/UserApi');
const createTokens = require('../../utils/JWT');

//USER PREFERENCE ROUTE
router.post('/', function (req, res, next) {
    // console.log(req.body)
    const accessToken = createTokens("users");
    res.cookie("access-Token", accessToken, {
        maxAge: 60 * 60 * 24 * 30 * 1000,
    });
    const min_age = req.body.min_age;
    const max_age = req.body.max_age;

    if (min_age > 18 && min_age < 100 && max_age < 100 && max_age > 18) {
        indexmodel.userPreferences(req.body, min_age, max_age, accessToken, (result) => {
            console.log("Result :", result);
            if (result) {
                console.log("userPreference added successfully");
                res.send("userPreference added successfully")
            }
            else {
                console.log("UserPreference already exists");
            }
        })
    }else{
        res.send("user input something wrong in age");
        console.log("user input something wrong in age");
    }

});

module.exports = router;