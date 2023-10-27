const { db, users, onboardings } = require('./connection');

function onboardModel() {

    //onboarding question api
    this.onboardingQuestion = (onboardings, userEmail, selectedOptions, callback) => {
        db.collection("onboardings").find().toArray()
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
                    onboardings._id = max_id + 1;
                } else {
                    onboardings._id = 1;
                }
                var flag = 1;
                if (result.length > 0) {
                    for (let row of result) {
                        if (onboardings._id == row._id) {
                            flag = 0;
                            break;
                        }
                    }
                }
                if (flag == 1) {
                    onboardings.OptedOption = selectedOptions
                    onboardings.userEmail = userEmail
                    onboardings.dt = Date();
                    db.collection("onboardings").insertOne(onboardings, (err, result) => {
                        if (err) {
                            console.log(err);
                            callback(false);
                        } else {
                            callback(true);
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





    //get all user api
    this.getUserDetails = (callback) => {
        db.collection("users").aggregate([
            {
                $lookup: {
                    from: "onboardings",
                    localField: "email",
                    foreignField: "userEmail",
                    as: "Details",
                },
            },
        ])
            .toArray()
            .then((data) => {
                callback(data);
                console.log(data)
            })
            .catch((err) => {
                console.log(err);
                callback([]);
            })
    };





    
    //update api for onboarding question
    this.updateonboarding = (onboardings, OptedOption,callback) => {
        db.collection("onboardings").find({ _id : onboardings._id, userEmail : onboardings.userEmail}).toArray()
            .then((result) => {
                console.log(result)
                if (result.length > 0) {
                    db.collection('onboardings').updateOne({ _id : onboardings._id ,userEmail : onboardings.userEmail}, { $set: { OptedOption: OptedOption } })
                        .then(() => {
                            console.log('onboarding updated successfully');
                            callback(result);
                        })
                        .catch((updateErr) => {
                            console.log('Error updating onboarding question:', updateErr);
                            callback([]);
                        });
                } else {
                    console.log('onboarding question not found.');
                    callback([]);
                }
            })
            .catch((err) => {
                console.log('Error:', err);
                callback([]);
            });
    }





}

module.exports = new onboardModel();