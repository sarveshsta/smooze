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

            console.log("user registered successfully");
        }
        else {
            if (result.msg) {
                console.log({ "msg": "invalid phone number" });
            }
            else {
                if (result.gen) {
                    console.log({ "gen": 'invalid gender' });
                }
                else {
                    if (result.msgState) {
                        console.log({ "msgState": 'Invalid state.' });
                    }
                    else {
                        if (result.msgCity) {
                            console.log({ "msgCity": 'Invalid city for the selected state.' });
                        }
                        else {
                            console.log("user already exists");
                        }
                    }
                }
            }


        }

    })
});

module.exports = router;