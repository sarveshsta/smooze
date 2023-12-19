// const { db, users, orders } = require('./connection');
// const {key_id,key_secret} = require('../constants/constants')
// const crypto = require('crypto');
// const Razorpay = require('razorpay');

// function OrderModel() {

//     this.order = (orders, amount,callback) => {
//         db.collection("orders").find().toArray()
//             .then((val) => {
//                 console.log(val);
//                 var result = val;
//                 if (result.length > 0) {
//                     var max_id = result[0]._id;
//                     for (let row of result) {
//                         if (max_id < row._id) {
//                             max_id = row._id;
//                         }
//                     }
//                     orders._id = max_id + 1;
//                 } else {
//                     orders._id = 1;
//                 }
//                 var flag = 1;
                
//                 let uuid = crypto.randomUUID();
//                 if (flag == 1) {
//                     orders.uuid = uuid
//                     orders.dt = new Date();
//                     db.collection("orders").insertOne(orders, (err) => {
//                         if (err) {
//                             console.log(err);
//                             callback(false);
//                         } else {
//                             var instance = new Razorpay(
//                                 {
//                                     key_id: key_id,
//                                     key_secret: key_secret
//                                 }
//                             )

//                             var options = {
//                                 amount: amount * 100,  
//                                 currency: "INR",
//                                 receipt: "rcp1"
//                             };
                            
//                             instance.orders.create(options, function (err, order) {
//                                 console.log(order);
//                             });
//                             callback(true)
                            

//                         }
//                     })
//                 } else {
//                     callback(false, { "msg": "" });
//                 }
//             })
//             .catch((err) => {
//                 console.log(err);
//                 callback(false);
//             });
//     }

// }

// module.exports = new OrderModel();

const { db, users, orders } = require('./connection');
const { key_id, key_secret } = require('../constants/constants');
const crypto = require('crypto');
const Razorpay = require('razorpay');

function OrderModel() {
    this.order = async (orders, amount, callback) => {
        try {
            const val = await db.collection("orders").find().toArray();

            console.log(val);
            var result = val;
            if (result.length > 0) {
                var max_id = result[0]._id;
                for (let row of result) {
                    if (max_id < row._id) {
                        max_id = row._id;
                    }
                }
                orders._id = max_id + 1;
            } else {
                orders._id = 1;
            }

            var flag = 1;

            let uuid = crypto.randomUUID();
            if (flag == 1) {
                orders.uuid = uuid;
                orders.dt = new Date();
                await db.collection("orders").insertOne(orders);

                var instance = new Razorpay({
                    key_id: key_id,
                    key_secret: key_secret
                });

                var options = {
                    amount: amount * 100,
                    currency: "INR",
                    receipt: "rcp1"
                };

                const order = await instance.orders.create(options);
                console.log(order);
                callback(true);
            } else {
                callback(false, { "msg": "" });
            }
        } catch (err) {
            console.log(err);
            callback(false);
        }
    };
}

module.exports = new OrderModel();
