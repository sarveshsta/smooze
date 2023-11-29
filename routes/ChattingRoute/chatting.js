var express = require('express');
var router = express.Router();
var ChattingModel = require('../../models/chattingApi');
const createTokens = require('../../utils/JWT');


//Message ROUTE
router.post('/', function (req, res, next) {
    const accessToken = createTokens("users");
    res.cookie("access-Token", accessToken, {
        maxAge: 60 * 60 * 24 * 30 * 1000,
    });
    ChattingModel.chatting(req.body, accessToken, (result) => {
        console.log("Result :", result);
        if (result) {
            res.send("Message Sent Successfully");
            console.log("Message Sent Successfully");
        }
        else {
            res.send("error while sending message");
            console.log("error while sending message");
        }
    })
});

module.exports = router;