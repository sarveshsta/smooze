const { db, users, onboardings } = require('./connection');
const indianCities = require('indian-cities-database');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const fast2sms = require('fast-two-sms');
const createTokens = require('../utils/JWT');
const { EMAIL, PASS, authOTPKEY } = require('../constants/constants');
const otpGenerator = require('otp-generator');
const cities = indianCities.cities
const states = [...new Set(cities.map(city => city.state))];
const cities1 = [...new Set(cities.map(city => city.city))];

// console.log('Available states:', states);
// console.log('Available cities:', cities1);
// console.log(cities);

function indexmodel() {

    this.registeruser = (users, accessToken, callback) => {
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
                    users.token = accessToken
                    users.otp = ''
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
                    callback(false, { "msg": "" });
                }
            })
            .catch((err) => {
                console.log(err);
                callback(false);
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




    
    this.login_with_otp = (users, callback) => {
        db.collection('users').find({ phone: users.phone }).toArray()
            .then((result) => {
                if (result.length > 0) {
                    const OTP = otpGenerator.generate(4, {
                        digits: true,
                        lowerCaseAlphabets: false,
                        upperCaseAlphabets: false,
                        specialChars: false
                    });

                    const new_otp = OTP;
                    console.log("Generated OTP :", new_otp);

                    const options = {
                        authorization: authOTPKEY,
                        message: `Your OTP is: ${new_otp}`,
                        numbers: [users.phone]
                    };

                    fast2sms.sendMessage(options)
                        .then(() => {
                            db.collection("users").updateOne({phone : users.phone}, {$set : { otp : new_otp}})
                            .then(()=>{
                                console.log("added otp");
                            })
                            .catch((err)=>{
                                console.log(err);
                            })
                            callback(result, OTP);
                        })
                        .catch((err) => {
                            console.log('Error sending OTP:', err);
                            callback([], null);
                        });
                } else {
                    console.log('User not found.');
                    callback([], null);
                }
            })
            .catch((err) => {
                console.log('Error:', err);
                callback([], null);
            });
    };



    this.VerifyOTP = (users , otp,callback) => {
        db.collection('users').find({ phone: users.phone }).toArray()
            .then((result) => {
                if (result.length > 0) {
                    if(otp == users.otp){
                        callback(result);
                        db.collection("users").updateOne({phone : users.phone}, {$set : { otp : ''}})
                        .then(()=>{
                            console.log("otp used");
                        })
                        .catch((err)=>{
                            console.log(err);
                        })
                    }else{
                        console.log("otp not matched");
                    }     
                }
                else{
                    console.log('User not found.');
                    callback([], null);
                }
            })
            .catch((err)=>{
                console.log(err);
            })
    };




    this.deactivateUser = (users, callback) => {
        db.collection('users').updateOne({ email: users.email }, { $set: { Isactive: false } })
            .then((result) => {
                if (result.length > 0) {
                    const user = result[0];
                    const dbPassword = user.password;
                    bcrypt.compare(user.password, dbPassword).then((match) => {
                        if (!match) {
                            console.log("user credentials not matched");
                            callback([]);
                        } else {
                            // console.log('User deactivated.');
                            callback(result);
                        }
                    });
                } else {
                    console.log('User not found.');
                    callback([]);
                }
            })
            .catch((updateErr) => {
                console.log('Error deactivating user:', updateErr);
                callback(false);
            });
    }




    this.deleteuser = (users, callback) => {
        db.collection('users').deleteOne({ email: users.email })
            .then((result) => {
                if (result.length > 0) {
                    const user = result[0];
                    const dbPassword = user.password;
                    bcrypt.compare(user.password, dbPassword).then((match) => {
                        if (!match) {
                            console.log("user credentials not matched");
                            callback([]);
                        } else {
                            callback(result);
                        }
                    });
                } else {
                    console.log('User not found.');
                    callback([]);
                }

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
        db.collection('users').find({ email: users.email }).toArray()
            .then((result) => {

                let config = {
                    service: 'gmail',
                    auth: {
                        user: EMAIL,
                        pass: PASS
                    }
                }

                let transporter = nodemailer.createTransport(config);
                let accessToken = createTokens("users");

                let message = {
                    from: EMAIL,
                    to: users.email,
                    subject: "Reset Password Mail",
                    html: '<p>hlo </p>' + '<b>' + users.name + '</b>' + '<b> please click here to <a href="http://localhost:3000/resetPassword?Token=' + accessToken + '">Verify</a> your mail.</b>'
                }

                transporter.sendMail(message, function (err, info) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Email has been sent", info.response);
                        callback(result);
                    }
                });

            })
            .catch((err) => {
                console.log('Error:', err);
                callback([]);
            });
    }



    //not working
    // this.resetPassword = (users, newPassword, Token, callback) => {
    //     db.collection('users').find({ token: users.token }).toArray()
    //         .then((result) => {
    //             if (Token == users.token) {
    //                 bcrypt.hash(newPassword, 10).then((hash) => {
    //                     console.log(hash);
    //                     db.collection("users").updateOne({ email: users.email }, { $set: { password: hash } })
    //                         .then(() => {
    //                             callback(result);
    //                         })
    //                         .catch((err) => {
    //                             console.log(err);
    //                             callback(false);
    //                         });
    //                 });
    //             }
    //             else {
    //                 console.log("Token not found or expired");
    //             }
    //         })
    //         .catch((err) => {
    //             console.log("Error:", err);
    //             callback(false);
    //         });
    // }


}

module.exports = new indexmodel();