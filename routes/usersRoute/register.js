var express = require('express');
var router = express.Router();
var indexmodel = require('../../models/UserApi');
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
            res.send("user registered successfully");
            console.log("user registered successfully");
        }
        else {
            if (result.msg) {
                res.send({ "msg": "invalid phone number" });
                console.log({ "msg": "invalid phone number" });
            }
            else {
                if (result.gen) {
                    res.send({ "gen": 'invalid gender' });
                    console.log({ "gen": 'invalid gender' });
                }
                else {
                    if (result.msgState) {
                        res.send({ "msgState": 'Invalid state.' });
                        console.log({ "msgState": 'Invalid state.' });
                    }
                    else {
                        if (result.msgCity) {
                            res.send({ "msgCity": 'Invalid city for the selected state.' });
                            console.log({ "msgCity": 'Invalid city for the selected state.' });
                        }
                        else {
                            res.send("user already exists");
                            console.log("user already exists");
                        }
                    }
                }
            }


        }

    })
});

module.exports = router;