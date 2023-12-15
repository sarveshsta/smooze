var express = require('express');
var router = express.Router();
var indexmodel = require('../../models/UserApi');
const createTokens10 = require('../../utils/JWT');


//REGISTER ROUTE
router.post('/', function (req, res, next) {
    const accessToken = createTokens10("commentsomeones");
    res.cookie("access-Token", accessToken, {
        maxAge: 60 * 60 * 24 * 30 * 1000,
    });
    indexmodel.CommentUser(req.body, (result) => {
        console.log("Result :", result);
        if (result) {
            res.send("user Commented person successfully");
            console.log("user Commented person successfully");
        } else {
            res.send("user already exists");
            console.log("user already exists");
        }
    });
});

module.exports = router;
