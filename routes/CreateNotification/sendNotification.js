var express = require('express');
var router = express.Router();
const Notifymodel = require('../../models/PushNotification');

router.post('/', function (req, res) {
    const uuid = req.body.uuid;
    const message = req.body.message;

    Notifymodel.sendNotification(uuid, message, (result) => {
        console.log("Result :", result);
        if (result) {
            res.send("Notification sent successfully ");
            console.log("Notification sent successfully");
        } else {
            res.send("Failed while sending notification");
            console.log("Failed while sending notification");
        }
    });
});
module.exports = router;