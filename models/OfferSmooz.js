const { db, offersmoozs } = require('./connection');


function OfferModel() {


    //Offer Smooz
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






    this.SmoozBill = (offersmoozs, callback) => {
        db.collection("offersmoozs").find({ UserEmail: offersmoozs.UserEmail }).toArray()
            .then((result) => {
                callback(result)
            })
            .catch((err) => {
                confirm.log(err)
            })
    }






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




}

module.exports = new OfferModel();