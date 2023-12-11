const Razorpay = require('razorpay');
var instance = new Razorpay(
    {
        key_id: 'YOUR_KEY_ID',
        key_secret: 'YOUR_SECRET'
    }
)

var options = {
    amount: TotalPrice,  
    currency: "INR",
    receipt: "rcp1"
};

const order = instance.orders.create(options, function (err, order) {
    console.log(order);
});


module.exports = order;
