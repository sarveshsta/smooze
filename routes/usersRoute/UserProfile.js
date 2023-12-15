var express = require('express');
var router = express.Router();
var indexmodel = require('../../models/UserApi');
const createTokens5 = require('../../utils/JWT');

//user profile ROUTE
router.post('/', function (req, res, next) {
    // console.log(req.body)
    const accessToken = createTokens5("profilequestion");
    res.cookie("access-Token", accessToken, {
        maxAge: 60 * 60 * 24 * 30 * 1000,
    });
    indexmodel.UserProfile(req.body, accessToken, (result) => {
        console.log("Result :", result);
        if (result) {
            console.log("UserProfile added successfully");
            res.send("UserProfile added successfully")
        }
        else {
            console.log("UserProfile already exists");
        }
    })
});

module.exports = router;