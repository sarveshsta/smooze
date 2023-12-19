// const { db, offersmoozs } = require('./connection');


// function OfferModel() {


//     //Offer Smooz (get the all user present in same location)
//     this.OfferSmooz = (callback) => {
//         db.collection("users").aggregate([
//             {
//                 $lookup: {
//                     from: "menu",
//                     localField: "location",
//                     foreignField: "Club_name",
//                     as: "Details",
//                 },
//             },
//         ]).toArray()
//             .then((data) => {
//                 callback(data);
//             })
//             .catch((err) => {
//                 console.log(err);
//             })
//     };





//     //Offer the smooz to a particular person
//     this.OfferedSmooz = (offersmoozs, TotalPrice, callback) => {
//         db.collection("offersmoozs").find().toArray()
//             .then((val => {
//                 console.log(val);
//                 var result = val;
//                 if (result.length > 0) {
//                     var max_id = result[0]._id;
//                     for (let row of result) {
//                         if (max_id < row._id) {
//                             max_id = row._id;
//                         }
//                     }
//                     offersmoozs._id = max_id + 1;
//                 } else {
//                     offersmoozs._id = 1;
//                 }
//                 var flag = 1;
//                 if (result.length > 0) {
//                     for (let row of result) {
//                         if (offersmoozs._id == row._id) {
//                             flag = 0;
//                             break;
//                         }
//                     }
//                 }
//                 let uuid = crypto.randomUUID();
//                 if (flag == 1) {
//                     offersmoozs.TotalPrice = TotalPrice
//                     offersmoozs.uuid = uuid
//                     offersmoozs.dt = Date();
//                     offersmoozs.option = "Reject"
//                     db.collection("offersmoozs").insertOne(offersmoozs, (err, result) => {
//                         if (err) {
//                             console.log(err);
//                             callback(false);
//                         } else {
//                             console.log(result)
//                             callback(result);
//                         }
//                     });
//                 } else {
//                     callback(false);
//                 }
//             }))
//             .catch((err) => {
//                 console.log(err);
//                 callback(false);
//             });
//     }





//     //billing of the smooz offered
//     this.SmoozBill = (offersmoozs, callback) => {
//         db.collection("offersmoozs").find({ UserEmail: offersmoozs.UserEmail }).toArray()
//             .then((result) => {
//                 callback(result)
//             })
//             .catch((err) => {
//                 confirm.log(err)
//             })
//     }





//     //recieve the smooz (Accept or Reject)
//     this.itemOfferedMe = (offersmoozs, option, callback) => {
//         db.collection("offersmoozs").find({ OfferSmoozEmail: offersmoozs.OfferSmoozEmail }).toArray()
//             .then((result) => {
//                 db.collection("offersmoozs").updateOne({ OfferSmoozEmail: offersmoozs.OfferSmoozEmail }, { $set: { option: option } })
//                     .then(() => {
//                         console.log("User Answered");
//                         callback(result);
//                     })
//                     .catch((updateErr) => {
//                         console.log('Error while answering the Offer:', updateErr);
//                     });
//             })
//     }


// }

// module.exports = new OfferModel();

const { db, offersmoozs } = require('./connection');
const crypto = require('crypto');

function OfferModel() {
    // Offer Smooz (get all users present in the same location)
    this.OfferSmooz = async (callback) => {
        try {
            const data = await db.collection("users").aggregate([
                {
                    $lookup: {
                        from: "menu",
                        localField: "location",
                        foreignField: "Club_name",
                        as: "Details",
                    },
                },
            ]).toArray();
            callback(data);
        } catch (err) {
            console.log(err);
        }
    };

    // Offer the Smooz to a particular person
    this.OfferedSmooz = async (offersmoozs, TotalPrice, callback) => {
        try {
            const val = await db.collection("offersmoozs").find().toArray();
            console.log(val);
            var result = val;
            if (result.length > 0) {
                var max_id = result[0]._id;
                for (let row of result) {
                    if (max_id < row._id) {
                        max_id = row._id;
                    }
                }
                offersmoozs._id = max_id + 1;
            } else {
                offersmoozs._id = 1;
            }
            var flag = 1;
            if (result.length > 0) {
                for (let row of result) {
                    if (offersmoozs._id == row._id) {
                        flag = 0;
                        break;
                    }
                }
            }
            let uuid = crypto.randomUUID();
            if (flag == 1) {
                offersmoozs.TotalPrice = TotalPrice;
                offersmoozs.uuid = uuid;
                offersmoozs.dt = Date();
                offersmoozs.option = "Reject";
                await db.collection("offersmoozs").insertOne(offersmoozs);
                callback(true);
            } else {
                callback(false);
            }
        } catch (err) {
            console.log(err);
            callback(false);
        }
    };

    // Billing of the Smooz offered
    this.SmoozBill = async (offersmoozs, callback) => {
        try {
            const result = await db.collection("offersmoozs").find({ UserEmail: offersmoozs.UserEmail }).toArray();
            callback(result);
        } catch (err) {
            console.log(err);
        }
    };

    // Receive the Smooz (Accept or Reject)
    this.itemOfferedMe = async (offersmoozs, option, callback) => {
        try {
            const result = await db.collection("offersmoozs").find({ OfferSmoozEmail: offersmoozs.OfferSmoozEmail }).toArray();
            await db.collection("offersmoozs").updateOne(
                { OfferSmoozEmail: offersmoozs.OfferSmoozEmail },
                { $set: { option: option } }
            );
            console.log("User Answered");
            callback(result);
        } catch (err) {
            console.log('Error while answering the Offer:', err);
        }
    };
}

module.exports = new OfferModel();
