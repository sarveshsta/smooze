var express = require('express');
var router = express.Router();
var indexmodel = require('../../models/UserApi');
const createTokens7 = require('../../utils/JWT');


//REGISTER ROUTE
router.post('/', function (req, res, next) {
    const accessToken = createTokens7("userlikesomeones");
    res.cookie("access-Token", accessToken, {
        maxAge: 60 * 60 * 24 * 30 * 1000,
    });
    indexmodel.UserLikeSomeOne(req.body, (result) => {
        console.log("Result :", result);
        if (result) {
            res.send("user liked person successfully");
            console.log("user liked person successfully");
        } else {
            res.send("user already exists");
            console.log("user already exists");
        }
    });
});

module.exports = router;
