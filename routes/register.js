var express = require('express');
var router = express.Router();
var indexmodel = require('../models/indexmodel');

//regsitration route
router.post('/', function (req, res, next) {
    // console.log(req.body)
    indexmodel.registeruser(req.body, (result) => {
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