const { db, users, profilequestions } = require('./connection');
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

    //user register api
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
                    users.IsEmailVerified = false
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




    //get user Photos
    this.getUserPhotos = (userphotos, image1, image2, image3, image4, accessToken, callback) => {
        db.collection("userphotos").find().toArray()
            .then((val) => {
                var result = val;
                if (result.length > 0) {
                    var max_id = result[0]._id;
                    for (let row of result) {
                        if (max_id < row._id) {
                            max_id = row._id;
                        }
                    }
                    userphotos._id = max_id + 1;
                } else {
                    userphotos._id = 1;
                }
                var flag = 1;
                if (result.length > 0) {
                    for (let row of result) {
                        if (userphotos._id == row._id) {
                            flag = 0;
                            break;
                        }
                    }
                }
                if (flag == 1) {
                    userphotos.image1 = image1;
                    userphotos.image2 = image2;
                    userphotos.image3 = image3;
                    userphotos.image4 = image4;
                    userphotos.role = "user";
                    userphotos.dt = new Date();
                    userphotos.token = accessToken;

                    // You should insert into the "userphotos" collection, not "users"
                    db.collection("userphotos").insertOne(userphotos, (err) => {
                        if (err) {
                            console.log(err);
                            callback(false);
                        } else {
                            callback(true);
                        }
                    });
                } else {
                    callback(false, { "msg": "" });
                }
            })
            .catch((err) => {
                console.log(err);
                callback(false);
            });
    }





    //user login api
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




    //login users with otp api
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
                            db.collection("users").updateOne({ phone: users.phone }, { $set: { otp: new_otp } })
                                .then(() => {
                                    console.log("added otp");
                                })
                                .catch((err) => {
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




    //Verify users OTP api
    this.VerifyOTP = (users, otp, callback) => {
        db.collection('users').find({ phone: users.phone }).toArray()
            .then((result) => {
                if (result.length > 0) {
                    if (otp == users.otp) {
                        callback(result);
                        db.collection("users").updateOne({ phone: users.phone }, { $set: { otp: '' } })
                            .then(() => {
                                console.log("otp used");
                            })
                            .catch((err) => {
                                console.log(err);
                            })
                    } else {
                        console.log("otp not matched");
                    }
                }
                else {
                    console.log('User not found.');
                    callback([], null);
                }
            })
            .catch((err) => {
                console.log(err);
            })
    };




    //deactivate users api
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





    //delete user api
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







    //sending mail for forgot password api
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







    // UPDATE NAME API
    this.updateName = (users, name, callback) => {
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
                            db.collection('users').updateOne({ email: users.email }, { $set: { name: name } })
                                .then(() => {
                                    callback(result);
                                })
                                .catch((updateErr) => {
                                    console.log('Error updating users name :', updateErr);
                                });
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
    }







    //UPDATE PHONE API
    this.updatePhone = (users, phone, callback) => {
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
                            db.collection('users').updateOne({ email: users.email }, { $set: { phone: phone } })
                                .then(() => {
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
                                            db.collection("users").updateOne({ phone: users.phone }, { $set: { otp: new_otp } })
                                                .then(() => {
                                                    console.log("added otp");
                                                })
                                                .catch((err) => {
                                                    console.log(err);
                                                })
                                            callback(result, OTP);
                                        })
                                        .catch((err) => {
                                            console.log('Error sending OTP:', err);
                                            callback([], null);
                                        });
                                    // callback(result);
                                })
                                .catch((updateErr) => {
                                    console.log('Error updating users phone:', updateErr);
                                });
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
    }






    //UPDATE EMAIL API
    this.updateEmail = (users, newemail, callback) => {
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
                            db.collection('users').updateOne({ email: users.email }, { $set: { email: newemail } })
                                .then(() => {
                                    callback(result);
                                })
                                .catch((updateErr) => {
                                    console.log('Error updating users email:', updateErr);
                                });
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
    }









    //UPDATE location API
    this.updateLocation = (users, newLocation, callback) => {
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
                            db.collection('users').updateOne({ email: users.email }, { $set: { location: newLocation } })
                                .then(() => {
                                    callback(result);
                                })
                                .catch((updateErr) => {
                                    console.log('Error updating users location:', updateErr);
                                });
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
    }







    //get User Details With Photos
    this.getUserDetailsWithPhotos = (callback) => {
        db.collection("users").aggregate([
            {
                $lookup: {
                    from: "userphotos",
                    localField: "email",
                    foreignField: "email",
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
    }





    //getting userprofile details from user
    this.UserProfile = (profilequestions, accessToken, callback) => {
        db.collection("profilequestions").find().toArray()
            .then((val) => {
                console.log(val);
                var result = val;
                let max_id = 0;
                if (result.length > 0) {
                    max_id = Math.max(...result.map((row) => row._id));
                }
                profilequestions._id = max_id + 1;

                let flag = 1;
                if (result.length > 0) {
                    for (let row of result) {
                        if (profilequestions.userEmail == row.userEmail) {
                            flag = 0;
                            break;
                        }
                    }
                }

                if (flag == 1) {
                    profilequestions.role = "user"
                    profilequestions.dt = new Date();
                    profilequestions.token = accessToken;
                    db.collection("profilequestions").insertOne(profilequestions, (err) => {
                        if (err) {
                            console.log(err);
                            callback(false);
                        } else {
                            callback(true)
                        }
                    });
                } else {
                    callback(false);
                }
            })
            .catch((err) => {
                console.log(err);
                callback(false);
            });
    }






    //edit Bio in user Profile
    this.EditProfileBio = (profilequestions, Bio, callback) => {
        db.collection("profilequestions").find({ userEmail: profilequestions.userEmail }).toArray()
            .then((result) => {
                console.log(result)
                if (result.length > 0) {
                    db.collection('profilequestions').updateOne({ userEmail: profilequestions.userEmail }, { $set: { Bio: Bio } })
                        .then(() => {
                            console.log('user Bio updated successfully');
                            callback(result);
                        })
                        .catch((updateErr) => {
                            console.log('Error while updating user bio', updateErr);
                            callback([]);
                        });
                } else {
                    console.log('user profile not found.');
                    callback([]);
                }
            })
            .catch((err) => {
                console.log('Error:', err);
                callback([]);
            });
    }






    //edit Intrest in user Profile
    this.EditProfileIntrest = (profilequestions, Intrest, callback) => {
        db.collection("profilequestions").find({ userEmail: profilequestions.userEmail }).toArray()
            .then((result) => {
                console.log(result)
                if (result.length > 0) {
                    db.collection('profilequestions').updateOne({ userEmail: profilequestions.userEmail }, { $set: { Intrest: Intrest } })
                        .then(() => {
                            console.log('user Intrest updated successfully');
                            callback(result);
                        })
                        .catch((updateErr) => {
                            console.log('Error while updating user Intrest', updateErr);
                            callback([]);
                        });
                } else {
                    console.log('user profile not found.');
                    callback([]);
                }
            })
            .catch((err) => {
                console.log('Error:', err);
                callback([]);
            });
    }







    //edit Language in user Profile
    this.EditProfileLanguage = (profilequestions, Language, callback) => {
        db.collection("profilequestions").find({ userEmail: profilequestions.userEmail }).toArray()
            .then((result) => {
                console.log(result)
                if (result.length > 0) {
                    db.collection('profilequestions').updateOne({ userEmail: profilequestions.userEmail }, { $set: { Language: Language } })
                        .then(() => {
                            console.log('user Language updated successfully');
                            callback(result);
                        })
                        .catch((updateErr) => {
                            console.log('Error while updating user Language', updateErr);
                            callback([]);
                        });
                } else {
                    console.log('user profile not found.');
                    callback([]);
                }
            })
            .catch((err) => {
                console.log('Error:', err);
                callback([]);
            });
    }






    //edit Height in user Profile
    this.EditProfileHeight = (profilequestions, Height, callback) => {
        db.collection("profilequestions").find({ userEmail: profilequestions.userEmail }).toArray()
            .then((result) => {
                console.log(result)
                if (result.length > 0) {
                    db.collection('profilequestions').updateOne({ userEmail: profilequestions.userEmail }, { $set: { Height: Height } })
                        .then(() => {
                            console.log('user Height updated successfully');
                            callback(result);
                        })
                        .catch((updateErr) => {
                            console.log('Error while updating user Height', updateErr);
                            callback([]);
                        });
                } else {
                    console.log('user profile not found.');
                    callback([]);
                }
            })
            .catch((err) => {
                console.log('Error:', err);
                callback([]);
            });
    }






    //edit Work in user Profile
    this.EditProfileWork = (profilequestions, Work, callback) => {
        db.collection("profilequestions").find({ userEmail: profilequestions.userEmail }).toArray()
            .then((result) => {
                console.log(result)
                if (result.length > 0) {
                    db.collection('profilequestions').updateOne({ userEmail: profilequestions.userEmail }, { $set: { Work: Work } })
                        .then(() => {
                            console.log('user work updated successfully');
                            callback(result);
                        })
                        .catch((updateErr) => {
                            console.log('Error while updating user work', updateErr);
                            callback([]);
                        });
                } else {
                    console.log('user profile not found.');
                    callback([]);
                }
            })
            .catch((err) => {
                console.log('Error:', err);
                callback([]);
            });
    }






}

module.exports = new indexmodel();