var express = require('express');
var router = express.Router();
const Notifymodel = require('../../models/PushNotification');

router.post('/', function (req, res) {
    const uuid = req.body.uuid;
    const message = req.body.message;
    const ReciverID = req.body.ReciverID;
    Notifymodel.inAppMessaging(uuid, message,ReciverID, (result) => {
        console.log("Result :", result);
        if (result) {
            res.send("Message sent successfully ");
            console.log("Message sent successfully");
        } else {
            res.send("Failed while sending message");
            console.log("Failed while sending message");
        }
    });
});
module.exports = router;