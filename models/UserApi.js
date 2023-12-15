const { db, users, profilequestions, preferences, userlikesomeones, userdislikesomeones, commentsomeone } = require('./connection');
const indianCities = require('indian-cities-database');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const fast2sms = require('fast-two-sms');
const createTokens = require('../utils/JWT');
const { EMAIL, PASS, authOTPKEY, SSID, AUth_TOKEN, PhoneNumber } = require('../constants/constants');
const twilio = require('twilio');
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
                        if (users.email == row.email || users.phone == row.phone) {
                            flag = 0;
                            break;
                        }
                    }
                }

                let uuid = crypto.randomUUID();
                if (flag == 1) {
                    users.uuid = uuid
                    users.status = 0;
                    users.role = "user";
                    users.dt = new Date();  // Use new Date() to get the current date and time
                    users.Isactive = false
                    users.IsGoogle = false
                    users.IsApple = false
                    users.IsEmailVerified = false
                    users.isLiked = false
                    users.isDisLiked = false
                    users.isSuperLiked = false
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
                let uuid = crypto.randomUUID();
                if (flag == 1) {
                    userphotos.uuid = uuid
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
        db.collection('users').find({ phone: users.phone, email: users.email }).toArray()
            .then((result) => {
                console.log(users.phone);
                console.log(users.email);
                if (result.length > 0) {
                    const OTP = otpGenerator.generate(6, {
                        digits: true,
                        lowerCaseAlphabets: false,
                        upperCaseAlphabets: false,
                        specialChars: false
                    });

                    const new_otp = OTP;
                    console.log("Generated OTP :", new_otp);

                    const client = new twilio(SSID, AUth_TOKEN)

                    let msgOption = {
                        from: PhoneNumber,
                        to: `+91${users.phone}`,
                        body: `your otp is ${new_otp}`
                    }

                    console.log("Before Twilio message sending");
                    client.messages.create(msgOption)
                        .then((result) => {
                            console.log("Twilio message sent successfully:", result);
                            callback(true, new_otp);
                        })
                        .catch((err) => {
                            console.log("Error sending Twilio message:", err);
                            callback(false, null);
                        });
                    console.log("After Twilio message sending");
                    // const options = {
                    //     authorization: 'faN7rOkRV6bzZxUFItYL5Ch9HKQASwj4v0upoTP21slg8MW3De0ymaFAHrVi3fOITZ4K6nkdDxGvR7Pg',
                    //     message: `Your OTP is: ${new_otp}`,
                    //     numbers: [users.phone]
                    // };

                    // fast2sms.sendMessage(options)
                    //     .then((response) => {
                    //         console.log('Fast2SMS API Response:', response);
                    //         db.collection("users").updateOne({ phone: users.phone, email: users.email }, { $set: { otp: new_otp } })
                    //             .then(() => {
                    //                 console.log("Added OTP to the user in the database");
                    //                 callback(result, OTP);
                    //             })
                    //             .catch((err) => {
                    //                 console.log("Error updating OTP in the database:", err);
                    //                 callback([], null);
                    //             });
                    //     })
                    //     .catch((err) => {
                    //         console.log('Error sending OTP:', err);
                    //         callback([], null);
                    //     });
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
                            db.collection("users").updateOne({ email: users.email }, { $set: { Isactive: false } })
                                .then((result) => {
                                    callback(result)
                                })
                                .catch((err) => {
                                    console.log(err)
                                })
                            // console.log('User deactivated.');
                            // callback(result);
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






    //logout api
    this.logout = (users, callback) => {
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
                            db.collection("users").updateOne({ email: users.email }, { $set: { Isactive: false } })
                                .then((result) => {
                                    callback(result)
                                })
                                .catch((err) => {
                                    console.log(err)
                                })
                        }
                    });
                } else {
                    console.log('User not found.');
                    callback([]);
                }
            })
            .catch((updateErr) => {
                console.log('Error while logout:', updateErr);
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
    //     db.collection('users').find({ email : users.email }).toArray()
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

    this.resetPassword = (Token, newPassword, users, callback) => {
        db.collection('users').find({ email: users.email }).toArray()
            .then((result) => {
                if (result.length > 0 && Token == users.token) {
                    bcrypt.hash(newPassword, 10).then((hash) => {
                        console.log(hash);
                        db.collection("users").updateOne({ email: users.email }, { $set: { password: hash } })
                            .then(() => {
                                callback(result);
                            })
                            .catch((err) => {
                                console.log(err);
                                callback(false);
                            });
                    });
                } else {
                    console.log("Token not found or expired");
                    callback(false);
                }
            })
            .catch((err) => {
                console.log("Error:", err);
                callback(false);
            });
    }








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
                let uuid = crypto.randomUUID();
                if (flag == 1) {
                    profilequestions.uuid = uuid
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







    //getUserDetailsWithProfileQuestions
    this.getUserProfileQuestions = (callback) => {
        db.collection("users").aggregate([
            {
                $lookup: {
                    from: "profilequestions",
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








    //delete profile api
    this.DeleteProfile = (userEmail, callback) => {
        db.collection('profilequestions').deleteOne({ userEmail: userEmail })
            .then((result) => {
                if (result.deletedCount > 0) {
                    console.log('Profile deleted successfully.');
                    callback(true);
                } else {
                    console.log('Profile not found.');
                    callback(false);
                }
            })
            .catch((err) => {
                console.log(err);
                callback(false);
            });
    };









    //update api of star sign
    this.EditProfileStarSign = (profilequestions, newStarSign, callback) => {
        db.collection("profilequestions").find({ userEmail: profilequestions.userEmail }).toArray()
            .then((result) => {
                console.log(result)
                if (result.length > 0) {
                    db.collection('profilequestions').updateOne({ userEmail: profilequestions.userEmail }, { $set: { StarSign: newStarSign } })
                        .then(() => {
                            console.log('user newStarSign updated successfully');
                            callback(result);
                        })
                        .catch((updateErr) => {
                            console.log('Error while updating user newStarSign', updateErr);
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







    //create user preference model
    this.userPreferences = (preferences, min_age, max_age, accessToken, callback) => {
        db.collection("preferences").find().toArray()
            .then((val) => {
                console.log(val);
                var result = val;
                let max_id = 0;
                if (result.length > 0) {
                    max_id = Math.max(...result.map((row) => row._id));
                }
                preferences._id = max_id + 1;

                let flag = 1;
                if (result.length > 0) {
                    for (let row of result) {
                        if (preferences.userEmail == row.userEmail) {
                            flag = 0;
                            break;
                        }
                    }
                }
                let uuid = crypto.randomUUID();
                if (flag == 1) {
                    preferences.uuid = uuid
                    preferences.min_age = min_age
                    preferences.max_age = max_age
                    preferences.role = "user"
                    preferences.dt = new Date();
                    preferences.token = accessToken;
                    db.collection("preferences").insertOne(preferences, (err) => {
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






    //update min and max age 
    this.update_Min_Max_Age = (preferences, newMinAge, newMaxAge, callback) => {
        db.collection("preferences").find({ userEmail: preferences.userEmail }).toArray()
            .then((result) => {
                console.log(result)
                if (result.length > 0) {
                    db.collection('preferences').updateOne({ userEmail: preferences.userEmail }, { $set: { min_age: newMinAge, max_age: newMaxAge } })
                        .then(() => {
                            console.log('new min and max Age updated successfully');
                            callback(result);
                        })
                        .catch((updateErr) => {
                            console.log('Error while updating new Min and max Age', updateErr);
                            callback([]);
                        });
                } else {
                    console.log('user preference not found.');
                    callback([]);
                }
            })
            .catch((err) => {
                console.log('Error:', err);
                callback([]);
            });
    }






    //Update Distance api
    this.updateDistanceRadius = (preferences, newDistanceRadius, callback) => {
        db.collection("preferences").find({ userEmail: preferences.userEmail }).toArray()
            .then((result) => {
                console.log(result)
                if (result.length > 0) {
                    db.collection('preferences').updateOne({ userEmail: preferences.userEmail }, { $set: { DistanceRadius: newDistanceRadius } })
                        .then(() => {
                            console.log('new Distance updated successfully');
                            callback(result);
                        })
                        .catch((updateErr) => {
                            console.log('Error while updating new Distance', updateErr);
                            callback([]);
                        });
                } else {
                    console.log('user preference not found.');
                    callback([]);
                }
            })
            .catch((err) => {
                console.log('Error:', err);
                callback([]);
            });
    }






    // user like someone api
    this.UserLikeSomeOne = (userlikesomeones, callback) => {
        db.collection("userlikesomeones").find().toArray()
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
                    userlikesomeones._id = max_id + 1;
                } else {
                    userlikesomeones._id = 1;
                }
                var flag = 1;
                if (result.length > 0) {
                    for (let row of result) {
                        if (userlikesomeones._id == row._id) {
                            flag = 0;
                            break;
                        }
                    }
                }

                let uuid = crypto.randomUUID();

                if (flag == 1) {
                    userlikesomeones.isLiked = true;
                    userlikesomeones.uuid = uuid;
                    userlikesomeones.dt = Date();
                    db.collection("userlikesomeones").insertOne(userlikesomeones, (err) => {
                        if (err) {
                            console.log(err);
                            if (callback) {
                                callback(false);
                            }
                        } else {
                            db.collection("users").updateOne({ email: userlikesomeones.UserEmail }, { $set: { isLiked: true } })
                                .then(() => {
                                    if (callback) {
                                        callback(true);
                                    }
                                })
                                .catch((err) => {
                                    console.log(err);
                                    if (callback) {
                                        callback(false);
                                    }
                                });
                        }
                    });
                } else {
                    if (callback) {
                        callback(false);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
                if (callback) {
                    callback(false);
                }
            });
    };












    // user Like Retreve  api
    this.RetreveLike = (userlikesomeones, callback) => {
        db.collection('userlikesomeones').deleteOne({ UserEmail: userlikesomeones.UserEmail, LikedTo: userlikesomeones.LikedTo })
            .then((result) => {
                if (result.deletedCount > 0) {
                    db.collection("users").updateOne({ email: userlikesomeones.UserEmail }, { $set: { isLiked: false } })
                        .then(() => {
                            if (callback) {
                                callback(true);
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                            if (callback) {
                                callback(false);
                            }
                        });

                } else {
                    console.log('User not found.');
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }







    //Useapir DisLike 
    this.UserDisLikeSomeOne = (userdislikesomeones, callback) => {
        db.collection("userdislikesomeones").find().toArray()
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
                    userdislikesomeones._id = max_id + 1;
                } else {
                    userdislikesomeones._id = 1;
                }
                var flag = 1;
                if (result.length > 0) {
                    for (let row of result) {
                        if (userdislikesomeones._id == row._id) {
                            flag = 0;
                            break;
                        }
                    }
                }

                let uuid = crypto.randomUUID();

                if (flag == 1) {
                    userdislikesomeones.isDisLiked = true;
                    userdislikesomeones.uuid = uuid;
                    userdislikesomeones.dt = Date();
                    db.collection("userdislikesomeones").insertOne(userdislikesomeones, (err) => {
                        if (err) {
                            console.log(err);
                            if (callback) {
                                callback(false);
                            }
                        } else {
                            db.collection("users").updateOne({ email: userdislikesomeones.UserEmail }, { $set: { isDisLiked: true } })
                                .then(() => {
                                    if (callback) {
                                        callback(true);
                                    }
                                })
                                .catch((err) => {
                                    console.log(err);
                                    if (callback) {
                                        callback(false);
                                    }
                                });
                        }
                    });
                } else {
                    if (callback) {
                        callback(false);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
                if (callback) {
                    callback(false);
                }
            });
    }









    // user DisLike Retreve  api
    this.RetreveDisLike = (userdislikesomeones, callback) => {
        db.collection('userdislikesomeones').deleteOne({ UserEmail: userdislikesomeones.UserEmail, DisLikedTo: userdislikesomeones.DisLikedTo })
            .then((result) => {
                if (result.deletedCount > 0) {
                    db.collection("users").updateOne({ email: userdislikesomeones.UserEmail }, { $set: { isDisLiked: false } })
                        .then(() => {
                            if (callback) {
                                callback(true);
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                            if (callback) {
                                callback(false);
                            }
                        });

                } else {
                    console.log('User not found.');
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }








    //user SuperLike Someone api
    this.UserSuperLikeSomeOne = (usersuperlikesomeones, callback) => {
        db.collection("usersuperlikesomeones").find().toArray()
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
                    usersuperlikesomeones._id = max_id + 1;
                } else {
                    usersuperlikesomeones._id = 1;
                }
                var flag = 1;
                if (result.length > 0) {
                    for (let row of result) {
                        if (usersuperlikesomeones._id == row._id) {
                            flag = 0;
                            break;
                        }
                    }
                }

                let uuid = crypto.randomUUID();

                if (flag == 1) {
                    usersuperlikesomeones.isSuperDisLiked = true;
                    usersuperlikesomeones.uuid = uuid;
                    usersuperlikesomeones.dt = Date();
                    db.collection("usersuperlikesomeones").insertOne(usersuperlikesomeones, (err) => {
                        if (err) {
                            console.log(err);
                            if (callback) {
                                callback(false);
                            }
                        } else {
                            db.collection("users").updateOne({ email: usersuperlikesomeones.UserEmail }, { $set: { isSuperLiked: true } })
                                .then(() => {
                                    if (callback) {
                                        callback(true);
                                    }
                                })
                                .catch((err) => {
                                    console.log(err);
                                    if (callback) {
                                        callback(false);
                                    }
                                });
                        }
                    });
                } else {
                    if (callback) {
                        callback(false);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
                if (callback) {
                    callback(false);
                }
            });
    }






    //get liked user api
    this.getLikedUser = (callback) => {
        db.collection("users")
            .aggregate([
                {
                    $lookup: {
                        from: "userlikesomeones",
                        localField: "email",
                        foreignField: "UserEmail",
                        as: "Details",
                    },
                },

            ]).toArray()
            .then((data) => {
                callback(data);
                console.log(data)
            })
            .catch((err) => {
                console.log(err);
            })
    }







    // get user like Count api
    this.getLikeCount = (userlikesomeones, callback) => {
        db.collection("userlikesomeones").aggregate([
            {
                $match: { UserEmail: userlikesomeones.UserEmail }
            },
            {
                $count: "mycount"
            },
        ]).toArray()
            .then((data) => {
                callback(data);
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }










    // get user Dislike Count api
    this.getDisLikeCount = (userdislikesomeones, callback) => {
        db.collection("userdislikesomeones").aggregate([
            {
                $match: { UserEmail: userdislikesomeones.UserEmail }
            },
            {
                $count: "mycount"
            },
        ]).toArray()
            .then((data) => {
                callback(data);
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }










    // get user Dislike Count api
    this.getSuperLikeCount = (usersuperlikesomeones, callback) => {
        db.collection("usersuperlikesomeones").aggregate([
            {
                $match: { UserEmail: usersuperlikesomeones.UserEmail }
            },
            {
                $count: "mycount"
            },
        ]).toArray()
            .then((data) => {
                callback(data);
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }











    // get user Dislike Count api
    this.getCommentCount = (commentsomeones, callback) => {
        db.collection("commentsomeones").aggregate([
            {
                $match: { UserEmail: commentsomeones.UserEmail }
            },
            {
                $count: "mycount"
            },
        ]).toArray()
            .then((data) => {
                callback(data);
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }












    //comment on user profile api
    this.CommentUser = (commentsomeones, callback) => {
        db.collection("commentsomeones").find().toArray()
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
                    commentsomeones._id = max_id + 1;
                } else {
                    commentsomeones._id = 1;
                }
                var flag = 1;
                if (result.length > 0) {
                    for (let row of result) {
                        if (commentsomeones._id == row._id) {
                            flag = 0;
                            break;
                        }
                    }
                }

                let uuid = crypto.randomUUID();

                if (flag == 1) {
                    commentsomeones.uuid = uuid;
                    commentsomeones.dt = Date();
                    db.collection("commentsomeones").insertOne(commentsomeones, (err) => {
                        if (err) {
                            console.log(err);
                            if (callback) {
                                callback(false);
                            }
                        } else {
                            callback(true);
                        }
                    });
                } else {
                    if (callback) {
                        callback(false);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
                if (callback) {
                    callback(false);
                }
            });
    }








}

module.exports = new indexmodel();


