var express = require('express');
var router = express.Router();
var indexmodel = require('../../models/allApis');
const createTokens = require('../../utils/JWT');

//REGISTER ROUTE

router.post('/', function (req, res, next) {
    // console.log(req.body)
    const accessToken = createTokens("users");
    res.cookie("access-Token", accessToken, {
        maxAge: 60 * 60 * 24 * 30 * 1000,
    });
    indexmodel.registeruser(req.body,accessToken,(result) => {
        console.log("Result :", result);
        if (result) {
            console.log("user added photos");
        }
        else {
            console.log("user unable to add photos")
        }
    })
});

module.exports = router;