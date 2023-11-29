const { db, offersmoozs } = require('./connection');
// const OneSignal = require('onesignal-node');
// const oneSignalClient = new OneSignal.Client({
//     app: {
//         appId: '9a9b763d-d0ca-44c9-ac39-011569b6c8a6',
//         appKey: 'OGM4ZDI4ZDQtYzA1Ny00MDA3LTg1MDYtYTllYmYwMzU2YzY0'
//     },
// });


function OfferModel() {


    //Offer Smooz (get the all user present in same location)
    this.OfferSmooz = (callback) => {
        db.collection("users").aggregate([
            {
                $lookup: {
                    from: "menu",
                    localField: "location",
                    foreignField: "Club_name",
                    as: "Details",
                },
            },
        ]).toArray()
            .then((data) => {
                callback(data);
            })
            .catch((err) => {
                console.log(err);
            })
    };





    //Offer the smooz to a particular person
    this.OfferedSmooz = (offersmoozs, TotalPrice, callback) => {
        db.collection("offersmoozs").find().toArray()
            .then((val => {
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
                    offersmoozs.TotalPrice = TotalPrice
                    offersmoozs.uuid = uuid
                    offersmoozs.dt = Date();
                    offersmoozs.option = "Reject"
                    db.collection("offersmoozs").insertOne(offersmoozs, (err, result) => {
                        if (err) {
                            console.log(err);
                            callback(false);
                        } else {
                            console.log(result)
                            callback(result);
                        }
                    });
                } else {
                    callback(false);
                }
            }))
            .catch((err) => {
                console.log(err);
                callback(false);
            });
    }





    //billing of the smooz offered
    this.SmoozBill = (offersmoozs, callback) => {
        db.collection("offersmoozs").find({ UserEmail: offersmoozs.UserEmail }).toArray()
            .then((result) => {
                callback(result)
            })
            .catch((err) => {
                confirm.log(err)
            })
    }





    //recieve the smooz (Accept or Reject)
    this.itemOfferedMe = (offersmoozs, option, callback) => {
        db.collection("offersmoozs").find({ OfferSmoozEmail: offersmoozs.OfferSmoozEmail }).toArray()
            .then((result) => {
                db.collection("offersmoozs").updateOne({ OfferSmoozEmail: offersmoozs.OfferSmoozEmail }, { $set: { option: option } })
                    .then(() => {
                        console.log("User Answered");
                        callback(result);
                    })
                    .catch((updateErr) => {
                        console.log('Error while answering the Offer:', updateErr);
                    });
            })
    }


    // // Function to handle accepting or rejecting offers
    // this.itemOfferedMe = (offersmoozs, option, callback) => {
    //     db.collection("offersmoozs").find({ OfferSmoozEmail: offersmoozs.OfferSmoozEmail }).toArray()
    //         .then((result) => {
    //             db.collection("offersmoozs").updateOne({ OfferSmoozEmail: offersmoozs.OfferSmoozEmail }, { $set: { option: option } })
    //                 .then(() => {
    //                     console.log("User Answered");

    //                     // Send OneSignal notification when user answers an offer
    //                     const notification = {
    //                         contents: {
    //                             en: `You have a new offer response: ${option === 'accept' ? 'Accepted' : 'Rejected'}`,
    //                         },
    //                         include_player_ids: [result[0].uuid], // Assuming you store the OneSignal player ID in your 'offersmoozs' collection
    //                     };

    //                     oneSignalClient.createNotification(notification)
    //                         .then(response => {
    //                             console.log("OneSignal notification sent:", response);
    //                             callback(result);
    //                         })
    //                         .catch(error => {
    //                             console.error("Error sending OneSignal notification:", error);
    //                             callback(result);
    //                         });
    //                 })
    //                 .catch((updateErr) => {
    //                     console.log('Error while answering the Offer:', updateErr);
    //                 });
    //         })
    // }




}

module.exports = new OfferModel();