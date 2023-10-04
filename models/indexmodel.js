const { db, users, onboardings } = require('./connection');
const indianCities = require('indian-cities-database');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const { EMAIL, PASS } = require('../constants/constants');
const cities = indianCities.cities
const states = [...new Set(cities.map(city => city.state))];
const cities1 = [...new Set(cities.map(city => city.city))];

// console.log('Available states:', states);
// console.log('Available cities:', cities1);
// console.log(cities);

function indexmodel() {

    this.registeruser = (users, callback) => {
        //PHONE VALIDATION
        if (!/^[0-9]{10}$/.test(users.phone)) {
            callback(false, { "msg": 'Invalid phone number' });
            return;
        }
        //GENDER VALIDATION
        if (!['Male', 'Female', 'Others'].includes(users.gender)) {
            callback(false, { "gen": 'Invalid gender' });
            return;
        }
        //STATES VALIDATION
        if (!states.includes(users.state)) {
            callback(false, { "msgState": 'Invalid state' });
            return;
        }
        //CITIES VALIDATION
        if (!cities1.includes(users.city)) {
            callback(false, { "msgCity": 'Invalid city for the selected state' });
            return;
        }

        db.collection("users").find().toArray()
            .then((val) => {
                console.log(val);
                var result = val;
                if (result.length > 0) {
                    var max_id = result[0]._id;
                    for (let row of result) {
                        if (max_id < row._id) {
                            max_id = row._id;
                        }
                    }
                    users._id = max_id + 1;
                } else {
                    users._id = 1;
                }
                var flag = 1;
                if (result.length > 0) {
                    for (let row of result) {
                        if (users.email == row.email) {
                            flag = 0;
                            break;
                        }
                    }
                }
                if (flag == 1) {
                    users.status = 0;
                    users.role = "user";
                    users.dt = new Date();  // Use new Date() to get the current date and time
                    users.Isactive = false
                    users.IsGoogle = false
                    users.IsApple = false
                    //INSERTING DATA INTO DATABASE
                    bcrypt.hash(users.password, 10).then((hash) => {
                        // console.log(hash);
                        db.collection("users").insertOne(users, (err) => {
                            if (err) {
                                console.log(err);
                                callback(false);
                            } else {
                                db.collection("users").updateOne(users, { $set: { password: hash } })
                                    .then(
                                        callback(true)
                                    )
                                    .catch((err) => {
                                        console.log(err);
                                    })
                            }
                        });
                    })
                } else {
                    callback(false, { "msg": 'User already exists' });
                }
            })
            .catch((err) => {
                console.log(err);
                callback(false, { "msg": 'Error registering user' });
            });
    };



    
    this.userlogin = (users, callback) => {
        //GETTING OR FETCHING THE DETAILS FROM DATABASE TO MATCH THE DETAILS GIVEN BY USER
        db.collection('users').find({ email: users.email }).toArray()
            .then((result) => {
                if (result.length > 0) {
                    const user = result[0];
                    const dbPassword = user.password;
                    bcrypt.compare(users.password, dbPassword).then((match) => {
                        if (!match) {
                            console.log("user credentials not matched");
                            callback([]);
                        } else {
                            if (!user.Isactive) {
                                // Activate the user
                                db.collection('users').updateOne({ email: users.email }, { $set: { Isactive: true } })
                                    .then(() => {
                                        console.log('User activated.');
                                    })
                                    .catch((updateErr) => {
                                        console.log('Error activating user:', updateErr);
                                    });
                            }
                            callback(result);
                        }
                    });
                } else {
                    console.log('User not found.');
                    callback([]);
                }
            })
            .catch((err) => {
                console.log('Error:', err);
                callback([]);
            });
    };
    



    this.deactivateUser = (users, callback) => {
        db.collection('users').updateOne({ email: users.email, password: users.password }, { $set: { Isactive: false } })
            .then((result) => {
                // console.log('User deactivated.');
                callback(result);
            })
            .catch((updateErr) => {
                console.log('Error deactivating user:', updateErr);
                callback(false);
            });
    }



    this.deleteuser = (users, callback) => {
        db.collection('users').deleteOne({ email: users.email, password: users.password })
            .then((result) => {
                callback(result);
            }).catch((err) => {
                console.log(err);
            });
    }



    this.onboardingQuestion = (onboardings, selectedOptions, callback) => {
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


    
    this.forgotPassword = (users, callback) => {
        db.collection('users').find({ email: users.email, password: users.password }).toArray()
            .then((result) => {
                if (result.length > 0) {
                    const user = result[0];
                    let config = {
                        service: 'gmail',
                        auth: {
                            user: EMAIL,
                            pass: PASS
                        }
                    }
                    let transporter = nodemailer.createTransport(config);

                    let message = {
                        from: EMAIL,
                        to: users.email,
                        subject: "Reset Password Mail",
                        html: '<p>hlo </p>' + '<b>' + users.name + '</b>' + '<b> please click here to <a href="http://localhost:8000/verifyMail?email=' + users.email + '">Verify</a> your mail.</b>'
                    }

                    transporter.sendMail(message, function (err, info) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Email has been sent", info.response);
                            callback(true);
                        }
                    })
                } else {
                    console.log('User not found.');
                }
            })
            .catch((err) => {
                console.log('Error:', err);
                callback([]);
            });
    }

}

module.exports = new indexmodel();
