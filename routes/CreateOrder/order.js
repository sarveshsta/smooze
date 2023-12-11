var express = require('express');
var router = express.Router();
const OrderModel = require('../../models/createOrder');


router.post('/', function (req, res, next) {
    const amount = req.body.amount
    OrderModel.order(amount, (result) => {
        console.log("Result :", result);
        if (result) {
            res.send("order successfully Done");
            console.log("order successfully Done");
        }
        else {
            res.send("failed while ordering");
            console.log("failed while ordering");
        }
    })
});

module.exports = router;