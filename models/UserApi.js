const { db, users, profilequestions, preferences, userlikesomeones, userdislikesomeones, commentsomeone } = require('./connection');
const indianCities = require('indian-cities-database');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const createTokens = require('../utils/JWT');
const { EMAIL, PASS, authOTPKEY, SSID, AUth_TOKEN, PhoneNumber, WhatsappNumber } = require('../constants/constants');
const twilio = require('twilio');
const otpGenerator = require('otp-generator');
const cities = indianCities.cities
const states = [...new Set(cities.map(city => city.state))];
const cities1 = [...new Set(cities.map(city => city.city))];

// console.log('Available states:', states);
// console.log('Available cities:', cities1);
// console.log(cities);

function indexmodel() {

    // //user register api
    // this.registeruser = (users, accessToken, callback) => {
    //     //PHONE VALIDATION
    //     if (!/^[0-9]{10}$/.test(users.phone)) {
    //         callback(false, { "msg": 'Invalid phone number' });
    //         return;
    //     }
    //     //GENDER VALIDATION
    //     if (!['Male', 'Female', 'Others'].includes(users.gender)) {
    //         callback(false, { "gen": 'Invalid gender' });
    //         return;
    //     }
    //     //STATES VALIDATION
    //     if (!states.includes(users.state)) {
    //         callback(false, { "msgState": 'Invalid state' });
    //         return;
    //     }
    //     //CITIES VALIDATION
    //     if (!cities1.includes(users.city)) {
    //         callback(false, { "msgCity": 'Invalid city for the selected state' });
    //         return;
    //     }
    //     db.collection("users").find().toArray()
    //         .then((val) => {
    //             console.log(val);
    //             var result = val;
    //             if (result.length > 0) {
    //                 var max_id = result[0]._id;
    //                 for (let row of result) {
    //                     if (max_id < row._id) {
    //                         max_id = row._id;
    //                     }
    //                 }
    //                 users._id = max_id + 1;
    //             } else {
    //                 users._id = 1;
    //             }
    //             var flag = 1;
    //             if (result.length > 0) {
    //                 for (let row of result) {
    //                     if (users.email == row.email || users.phone == row.phone) {
    //                         flag = 0;
    //                         break;
    //                     }
    //                 }
    //             }

    //             let uuid = crypto.randomUUID();
    //             if (flag == 1) {
    //                 users.uuid = uuid
    //                 users.status = 0;
    //                 users.role = "user";
    //                 users.dt = new Date();  // Use new Date() to get the current date and time
    //                 users.Isactive = false
    //                 users.IsGoogle = false
    //                 users.IsApple = false
    //                 users.IsEmailVerified = false
    //                 users.isLiked = false
    //                 users.isDisLiked = false
    //                 users.isSuperLiked = false
    //                 users.token = accessToken
    //                 users.otp = ''
    //                 //INSERTING DATA INTO DATABASE
    //                 bcrypt.hash(users.password, 10).then((hash) => {
    //                     // console.log(hash);
    //                     db.collection("users").insertOne(users, (err) => {
    //                         if (err) {
    //                             console.log(err);
    //                             callback(false);
    //                         } else {
    //                             db.collection("users").updateOne(users, { $set: { password: hash } })
    //                                 .then(
    //                                     callback(true)
    //                                 )
    //                                 .catch((err) => {
    //                                     console.log(err);
    //                                 })
    //                         }
    //                     });
    //                 })
    //             } else {
    //                 callback(false, { "msg": "" });
    //             }
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //             callback(false);
    //         });
    // };

    // user register api
    this.registeruser = async (users, accessToken, callback) => {
        try {
            // PHONE VALIDATION
            if (!/^[0-9]{10}$/.test(users.phone)) {
                callback(false, { "msg": 'Invalid phone number' });
                return;
            }

            // GENDER VALIDATION
            if (!['Male', 'Female', 'Others'].includes(users.gender)) {
                callback(false, { "gen": 'Invalid gender' });
                return;
            }

            // STATES VALIDATION
            if (!states.includes(users.state)) {
                callback(false, { "msgState": 'Invalid state' });
                return;
            }

            // CITIES VALIDATION
            if (!cities1.includes(users.city)) {
                callback(false, { "msgCity": 'Invalid city for the selected state' });
                return;
            }

            const result = await db.collection("users").find().toArray();

            let max_id = 1;

            if (result.length > 0) {
                max_id = Math.max(...result.map(row => row._id));
                users._id = max_id + 1;
            } else {
                users._id = 1;
            }

            let flag = 1;

            if (result.length > 0) {
                flag = result.every(row => !(users.email === row.email || users.phone === row.phone));
            }

            let uuid = crypto.randomUUID();

            if (flag) {
                users.uuid = uuid;
                users.status = 0;
                users.role = "user";
                users.dt = new Date();
                users.Isactive = false;
                users.IsGoogle = false;
                users.IsApple = false;
                users.IsEmailVerified = false;
                users.isLiked = false;
                users.isDisLiked = false;
                users.isSuperLiked = false;
                users.token = accessToken;
                users.otp = '';

                // INSERTING DATA INTO DATABASE
                const hash = await bcrypt.hash(users.password, 10);

                await db.collection("users").insertOne(users);
                await db.collection("users").updateOne(users, { $set: { password: hash } });

                callback(true);
            } else {
                callback(false, { "msg": "" });
            }
        } catch (err) {
            console.error(err);
            callback(false);
        }
    };







    // //get user Photos
    // this.getUserPhotos = (userphotos, image1, image2, image3, image4, accessToken, callback) => {
    //     db.collection("userphotos").find().toArray()
    //         .then((val) => {
    //             var result = val;
    //             if (result.length > 0) {
    //                 var max_id = result[0]._id;
    //                 for (let row of result) {
    //                     if (max_id < row._id) {
    //                         max_id = row._id;
    //                     }
    //                 }
    //                 userphotos._id = max_id + 1;
    //             } else {
    //                 userphotos._id = 1;
    //             }
    //             var flag = 1;
    //             if (result.length > 0) {
    //                 for (let row of result) {
    //                     if (userphotos._id == row._id) {
    //                         flag = 0;
    //                         break;
    //                     }
    //                 }
    //             }
    //             let uuid = crypto.randomUUID();
    //             if (flag == 1) {
    //                 userphotos.uuid = uuid
    //                 userphotos.image1 = image1;
    //                 userphotos.image2 = image2;
    //                 userphotos.image3 = image3;
    //                 userphotos.image4 = image4;
    //                 userphotos.role = "user";
    //                 userphotos.dt = new Date();
    //                 userphotos.token = accessToken;

    //                 // You should insert into the "userphotos" collection, not "users"
    //                 db.collection("userphotos").insertOne(userphotos, (err) => {
    //                     if (err) {
    //                         console.log(err);
    //                         callback(false);
    //                     } else {
    //                         callback(true);
    //                     }
    //                 });
    //             } else {
    //                 callback(false, { "msg": "" });
    //             }
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //             callback(false);
    //         });
    // }

    // get user Photos
    this.getUserPhotos = async (userphotos, image1, image2, image3, image4, accessToken, callback) => {
        try {
            const result = await db.collection("userphotos").find().toArray();

            let max_id = 0;
            if (result.length > 0) {
                max_id = Math.max(...result.map(row => row._id));
            }

            const flag = result.every(row => userphotos._id !== row._id);

            if (flag) {
                const uuid = crypto.randomUUID();
                userphotos._id = max_id + 1;
                userphotos.uuid = uuid;
                userphotos.image1 = image1;
                userphotos.image2 = image2;
                userphotos.image3 = image3;
                userphotos.image4 = image4;
                userphotos.role = "user";
                userphotos.dt = new Date();
                userphotos.token = accessToken;

                await db.collection("userphotos").insertOne(userphotos);
                callback(true);
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    };






    // //user login api
    // this.userlogin = (users, callback) => {
    //     //GETTING OR FETCHING THE DETAILS FROM DATABASE TO MATCH THE DETAILS GIVEN BY USER
    //     db.collection('users').find({ email: users.email }).toArray()
    //         .then((result) => {
    //             if (result.length > 0) {
    //                 const user = result[0];
    //                 const dbPassword = user.password;
    //                 bcrypt.compare(users.password, dbPassword).then((match) => {
    //                     if (!match) {
    //                         console.log("user credentials not matched");
    //                         callback([]);
    //                     } else {
    //                         if (!user.Isactive) {
    //                             // Activate the user
    //                             db.collection('users').updateOne({ email: users.email }, { $set: { Isactive: true } })
    //                                 .then(() => {
    //                                     console.log('User activated.');
    //                                 })
    //                                 .catch((updateErr) => {
    //                                     console.log('Error activating user:', updateErr);
    //                                 });
    //                         }
    //                         callback(result);
    //                     }
    //                 });
    //             } else {
    //                 console.log('User not found.');
    //                 callback([]);
    //             }
    //         })
    //         .catch((err) => {
    //             console.log('Error:', err);
    //             callback([]);
    //         });
    // };
    // User login API
    this.userlogin = async (users, callback) => {
        try {
            const result = await db.collection('users').find({ email: users.email }).toArray();

            if (result.length > 0) {
                const user = result[0];
                const dbPassword = user.password;

                const match = await bcrypt.compare(users.password, dbPassword);

                if (!match) {
                    console.log("User credentials not matched");
                    return [];
                } else {
                    if (!user.Isactive) {
                        // Activate the user
                        await db.collection('users').updateOne({ email: users.email }, { $set: { Isactive: true } });
                        console.log('User activated.');
                    }
                    callback(result)
                    return result;
                }
            } else {
                console.log('User not found.');
                return [];
            }
        } catch (err) {
            console.log('Error:', err);
            return [];
        }
    };






    // //login users with otp api
    // this.login_with_otp = (users, callback) => {
    //     db.collection('users').find({ uuid: users.uuid, phone: users.phone }).toArray()
    //         .then((result) => {
    //             console.log(users.phone);
    //             // console.log(users.email);
    //             if (result.length > 0) {
    //                 const OTP = otpGenerator.generate(6, {
    //                     digits: true,
    //                     lowerCaseAlphabets: false,
    //                     upperCaseAlphabets: false,
    //                     specialChars: false
    //                 });

    //                 const new_otp = OTP;
    //                 console.log("Generated OTP :", new_otp);

    //                 const client = new twilio(SSID, AUth_TOKEN)

    //                 let msgOption = {
    //                     from: PhoneNumber,
    //                     to: `+91${users.phone}`,
    //                     body: `your otp is ${new_otp}`
    //                 }

    //                 console.log("Before Twilio message sending");
    //                 client.messages.create(msgOption)
    //                     .then((result) => {
    //                         console.log("Twilio message sent successfully:", result);
    //                         callback(true, new_otp);
    //                     })
    //                     .catch((err) => {
    //                         console.log("Error sending Twilio message:", err);
    //                         callback(false, null);
    //                     });
    //                 console.log("After Twilio message sending");
    //                 // const options = {
    //                 //     authorization: 'faN7rOkRV6bzZxUFItYL5Ch9HKQASwj4v0upoTP21slg8MW3De0ymaFAHrVi3fOITZ4K6nkdDxGvR7Pg',
    //                 //     message: `Your OTP is: ${new_otp}`,
    //                 //     numbers: [users.phone]
    //                 // };

    //                 // fast2sms.sendMessage(options)
    //                 //     .then((response) => {
    //                 //         console.log('Fast2SMS API Response:', response);
    //                 //         db.collection("users").updateOne({ phone: users.phone, email: users.email }, { $set: { otp: new_otp } })
    //                 //             .then(() => {
    //                 //                 console.log("Added OTP to the user in the database");
    //                 //                 callback(result, OTP);
    //                 //             })
    //                 //             .catch((err) => {
    //                 //                 console.log("Error updating OTP in the database:", err);
    //                 //                 callback([], null);
    //                 //             });
    //                 //     })
    //                 //     .catch((err) => {
    //                 //         console.log('Error sending OTP:', err);
    //                 //         callback([], null);
    //                 //     });
    //             } else {
    //                 console.log('User not found.');
    //                 callback([], null);
    //             }
    //         })
    //         .catch((err) => {
    //             console.log('Error:', err);
    //             callback([], null);
    //         });
    // };
    // login users with otp api
    this.login_with_otp = async (users, callback) => {
        try {
            const result = await db.collection('users').find({ uuid: users.uuid, phone: users.phone }).toArray();

            console.log(users.phone);

            if (result.length > 0) {
                const OTP = otpGenerator.generate(6, {
                    digits: true,
                    lowerCaseAlphabets: false,
                    upperCaseAlphabets: false,
                    specialChars: false
                });

                const new_otp = OTP;
                console.log("Generated OTP :", new_otp);

                const client = new twilio(SSID, AUth_TOKEN);

                let msgOption = {
                    from: PhoneNumber,
                    to: `+91${users.phone}`,
                    body: `Hey! Welcome to Smooz, your otp is: ${new_otp}`
                };

                let messagesOption = {
                    from: `whatsapp:${WhatsappNumber}`,
                    to: `whatsapp:+91${users.phone}`,
                    body: `Hey! Welcome to Smooz, your otp is: ${new_otp}`
                };

                console.log("Before Twilio message sending");

                const twilioResult = await client.messages.create(msgOption);
                const twilioResult1 = await client.messages.create(messagesOption);
                console.log("Twilio message sent successfully:", twilioResult);
                console.log("Twilio message sent successfully:", twilioResult1);

                await db.collection('users').updateOne(
                    { uuid: users.uuid, phone: users.phone },
                    { $set: { otp: new_otp } }
                );

                callback(true, new_otp);

                console.log("After Twilio message sending");

            } else {
                console.log('User not found.');
                callback([], null);
            }
        } catch (err) {
            console.log('Error:', err);
            callback([], null);
        }
    };






    // //Verify users OTP api
    // this.VerifyOTP = (users, otp, callback) => {
    //     db.collection('users').find({ phone: users.phone }).toArray()
    //         .then((result) => {
    //             if (result.length > 0) {
    //                 if (otp == users.otp) {
    //                     callback(result);
    //                     db.collection("users").updateOne({ phone: users.phone }, { $set: { otp: '' } })
    //                         .then(() => {
    //                             console.log("otp used");
    //                         })
    //                         .catch((err) => {
    //                             console.log(err);
    //                         })
    //                 } else {
    //                     console.log("otp not matched");
    //                 }
    //             }
    //             else {
    //                 console.log('User not found.');
    //                 callback([], null);
    //             }
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         })
    // };
    // Verify users OTP api
    this.VerifyOTP = async (users, otp, callback) => {
        try {
            const result = await db.collection('users').find({ phone: users.phone }).toArray();

            if (result.length > 0) {
                if (otp == users.otp) {
                    callback(result);
                    await db.collection("users").updateOne({ phone: users.phone }, { $set: { otp: '' } });
                    console.log("otp used");
                } else {
                    console.log("otp not matched");
                }
            } else {
                console.log('User not found.');
                callback([], null);
            }
        } catch (err) {
            console.log(err);
        }
    };







    // //deactivate users api
    // this.deactivateUser = (users, callback) => {
    //     db.collection('users').find({ email: users.email }).toArray()
    //         .then((result) => {
    //             if (result.length > 0) {
    //                 const user = result[0];
    //                 const dbPassword = user.password;
    //                 bcrypt.compare(users.password, dbPassword).then((match) => {
    //                     if (!match) {
    //                         console.log("user credentials not matched");
    //                         callback([]);
    //                     } else {
    //                         db.collection("users").updateOne({ email: users.email }, { $set: { Isactive: false } })
    //                             .then((result) => {
    //                                 callback(result)
    //                             })
    //                             .catch((err) => {
    //                                 console.log(err)
    //                             })
    //                         // console.log('User deactivated.');
    //                         // callback(result);
    //                     }
    //                 });
    //             } else {
    //                 console.log('User not found.');
    //                 callback([]);
    //             }
    //         })
    //         .catch((updateErr) => {
    //             console.log('Error deactivating user:', updateErr);
    //             callback(false);
    //         });
    // }
    // deactivate users api
    deactivateUser = async (users, callback) => {
        try {
            const result = await db.collection('users').find({ email: users.email }).toArray();

            if (result.length > 0) {
                const user = result[0];
                const dbPassword = user.password;
                const match = await bcrypt.compare(users.password, dbPassword);

                if (!match) {
                    console.log("User credentials not matched");
                    return [];
                } else {
                    const updateResult = await db.collection("users").updateOne({ email: users.email }, { $set: { Isactive: false } });
                    console.log('User deactivated.');
                    callback(updateResult)
                    return updateResult;
                }
            } else {
                console.log('User not found.');
                return [];
            }
        } catch (error) {
            console.log('Error deactivating user:', error);
            return false;
        }
    };





    // //logout api
    // this.logout = (users, callback) => {
    //     db.collection('users').find({ email: users.email }).toArray()
    //         .then((result) => {
    //             if (result.length > 0) {
    //                 const user = result[0];
    //                 const dbPassword = user.password;
    //                 bcrypt.compare(users.password, dbPassword).then((match) => {
    //                     if (!match) {
    //                         console.log("user credentials not matched");
    //                         callback([]);
    //                     } else {
    //                         db.collection("users").updateOne({ email: users.email }, { $set: { Isactive: false } })
    //                             .then((result) => {
    //                                 callback(result)
    //                             })
    //                             .catch((err) => {
    //                                 console.log(err)
    //                             })
    //                     }
    //                 });
    //             } else {
    //                 console.log('User not found.');
    //                 callback([]);
    //             }
    //         })
    //         .catch((updateErr) => {
    //             console.log('Error while logout:', updateErr);
    //             callback(false);
    //         });
    // }
    // logout api
    this.logout = async (users, callback) => {
        try {
            const result = await db.collection('users').find({ email: users.email }).toArray();

            if (result.length > 0) {
                const user = result[0];
                const dbPassword = user.password;
                const match = await bcrypt.compare(users.password, dbPassword);

                if (!match) {
                    console.log("User credentials not matched");
                    return callback([]);
                }

                const updateResult = await db.collection("users").updateOne({ email: users.email }, { $set: { Isactive: false } });
                callback(updateResult);
            } else {
                console.log('User not found.');
                callback([]);
            }
        } catch (error) {
            console.log('Error while logout:', error);
            callback(false);
        }
    };








    // //delete user api
    // this.deleteuser = (users, callback) => {
    //     db.collection('users').deleteOne({ email: users.email })
    //         .then((result) => {
    //             if (result.length > 0) {
    //                 const user = result[0];
    //                 const dbPassword = user.password;
    //                 bcrypt.compare(user.password, dbPassword).then((match) => {
    //                     if (!match) {
    //                         console.log("user credentials not matched");
    //                         callback([]);
    //                     } else {
    //                         callback(result);
    //                     }
    //                 });
    //             } else {
    //                 console.log('User not found.');
    //                 callback([]);
    //             }

    //         }).catch((err) => {
    //             console.log(err);
    //         });
    // }
    // delete user api
    this.deleteuser = async (users, callback) => {
        try {
            const result = await db.collection('users').deleteOne({ email: users.email });

            if (result.length > 0) {
                const user = result[0];
                const dbPassword = user.password;

                const match = await bcrypt.compare(user.password, dbPassword);

                if (!match) {
                    console.log("user credentials not matched");
                    return [];
                } else {
                    callback(result);
                    return result;
                }
            } else {
                console.log('User not found.');
                return [];
            }
        } catch (err) {
            console.log(err);
            return [];
        }
    };







    // //sending mail for forgot password api
    // this.forgotPassword = (users, callback) => {
    //     db.collection('users').find({ email: users.email }).toArray()
    //         .then((result) => {

    //             let config = {
    //                 service: 'gmail',
    //                 auth: {
    //                     user: EMAIL,
    //                     pass: PASS
    //                 }
    //             }

    //             let transporter = nodemailer.createTransport(config);
    //             let accessToken = createTokens("users");

    //             let message = {
    //                 from: EMAIL,
    //                 to: users.email,
    //                 subject: "Reset Password Mail",
    //                 html: '<p>hlo </p>' + '<b>' + users.name + '</b>' + '<b> please click here to <a href="http://localhost:3000/resetPassword?Token=' + accessToken + '">Verify</a> your mail.</b>'
    //             }

    //             transporter.sendMail(message, function (err, info) {
    //                 if (err) {
    //                     console.log(err);
    //                 } else {
    //                     console.log("Email has been sent", info.response);
    //                     callback(result);
    //                 }
    //             });

    //         })
    //         .catch((err) => {
    //             console.log('Error:', err);
    //             callback([]);
    //         });
    // }
    //sending mail for forgot password api
    this.forgotPassword = async (users, callback) => {
        try {
            const result = await db.collection('users').find({ email: users.email }).toArray();

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

            const info = await transporter.sendMail(message);
            console.log("Email has been sent", info.response);
            callback(result);
        } catch (err) {
            console.log('Error:', err);
            callback([]);
        }
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

    // this.resetPassword = (Token, newPassword, users, callback) => {
    //     db.collection('users').find({ email: users.email }).toArray()
    //         .then((result) => {
    //             if (result.length > 0 && Token == users.token) {
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
    //             } else {
    //                 console.log("Token not found or expired");
    //                 callback(false);
    //             }
    //         })
    //         .catch((err) => {
    //             console.log("Error:", err);
    //             callback(false);
    //         });
    // }

    this.resetPassword = async (Token, newPassword, users, callback) => {
        try {
            const result = await db.collection('users').find({ email: users.email }).toArray();

            if (result.length > 0 && Token == users.token) {
                const hash = await bcrypt.hash(newPassword, 10);
                console.log(hash);

                await db.collection("users").updateOne({ email: users.email }, { $set: { password: hash } });

                callback(result);
            } else {
                console.log("Token not found or expired");
                callback(false);
            }
        } catch (err) {
            console.error("Error:", err);
            callback(false);
        }
    }







    // // UPDATE NAME API
    // this.updateName = (users, name, callback) => {
    //     db.collection('users').find({ email: users.email }).toArray()
    //         .then((result) => {
    //             if (result.length > 0) {
    //                 const user = result[0];
    //                 const dbPassword = user.password;
    //                 bcrypt.compare(users.password, dbPassword).then((match) => {
    //                     if (!match) {
    //                         console.log("user credentials not matched");
    //                         callback([]);
    //                     } else {
    //                         db.collection('users').updateOne({ email: users.email }, { $set: { name: name } })
    //                             .then(() => {
    //                                 callback(result);
    //                             })
    //                             .catch((updateErr) => {
    //                                 console.log('Error updating users name :', updateErr);
    //                             });
    //                     }
    //                 });
    //             } else {
    //                 console.log('User not found.');
    //                 callback([]);
    //             }
    //         })
    //         .catch((err) => {
    //             console.log('Error:', err);
    //             callback([]);
    //         });
    // }
    // UPDATE NAME API
    this.updateName = async (users, name, callback) => {
        try {
            const result = await db.collection('users').find({ email: users.email }).toArray();
            if (result.length > 0) {
                const user = result[0];
                const dbPassword = user.password;
                const match = await bcrypt.compare(users.password, dbPassword);
                if (!match) {
                    console.log("user credentials not matched");
                    return [];
                } else {
                    await db.collection('users').updateOne({ email: users.email }, { $set: { name: name } });
                    callback(result)
                    return result;
                }
            } else {
                console.log('User not found.');
                return [];
            }
        } catch (err) {
            console.log('Error:', err);
            return [];
        }
    }






    // //UPDATE PHONE API
    // this.updatePhone = (users, phone, callback) => {
    //     db.collection('users').find({ email: users.email }).toArray()
    //         .then((result) => {
    //             if (result.length > 0) {
    //                 const user = result[0];
    //                 const dbPassword = user.password;
    //                 bcrypt.compare(users.password, dbPassword).then((match) => {
    //                     if (!match) {
    //                         console.log("user credentials not matched");
    //                         callback([]);
    //                     } else {
    //                         db.collection('users').updateOne({ email: users.email }, { $set: { phone: phone } })
    //                             .then(() => {
    //                                 const OTP = otpGenerator.generate(4, {
    //                                     digits: true,
    //                                     lowerCaseAlphabets: false,
    //                                     upperCaseAlphabets: false,
    //                                     specialChars: false
    //                                 });

    //                                 const new_otp = OTP;
    //                                 console.log("Generated OTP :", new_otp);

    //                                 const options = {
    //                                     authorization: authOTPKEY,
    //                                     message: `Your OTP is: ${new_otp}`,
    //                                     numbers: [users.phone]
    //                                 };

    //                                 fast2sms.sendMessage(options)
    //                                     .then(() => {
    //                                         db.collection("users").updateOne({ phone: users.phone }, { $set: { otp: new_otp } })
    //                                             .then(() => {
    //                                                 console.log("added otp");
    //                                             })
    //                                             .catch((err) => {
    //                                                 console.log(err);
    //                                             })
    //                                         callback(result, OTP);
    //                                     })
    //                                     .catch((err) => {
    //                                         console.log('Error sending OTP:', err);
    //                                         callback([], null);
    //                                     });
    //                                 // callback(result);
    //                             })
    //                             .catch((updateErr) => {
    //                                 console.log('Error updating users phone:', updateErr);
    //                             });
    //                     }
    //                 });
    //             } else {
    //                 console.log('User not found.');
    //                 callback([]);
    //             }
    //         })
    //         .catch((err) => {
    //             console.log('Error:', err);
    //             callback([]);
    //         });
    // }
    // UPDATE PHONE API
    this.updatePhone = async (users, phone, callback) => {
        try {
            const result = await db.collection('users').find({ email: users.email }).toArray();
            if (result.length > 0) {
                const user = result[0];
                const dbPassword = user.password;
                const match = await bcrypt.compare(users.password, dbPassword);
                if (!match) {
                    console.log('user credentials not matched');
                    callback([]);
                } else {
                    await db.collection('users').updateOne({ email: users.email }, { $set: { phone: phone } });

                    const OTP = otpGenerator.generate(4, {
                        digits: true,
                        lowerCaseAlphabets: false,
                        upperCaseAlphabets: false,
                        specialChars: false,
                    });

                    const new_otp = OTP;
                    console.log('Generated OTP :', new_otp);

                    const options = {
                        authorization: authOTPKEY,
                        message: `Your OTP is: ${new_otp}`,
                        numbers: [users.phone],
                    };

                    await fast2sms.sendMessage(options);

                    await db.collection('users').updateOne({ phone: users.phone }, { $set: { otp: new_otp } });

                    console.log('added otp');
                    callback(result, OTP);
                }
            } else {
                console.log('User not found.');
                callback([]);
            }
        } catch (err) {
            console.log('Error:', err);
            callback([]);
        }
    };








    // //UPDATE EMAIL API
    // this.updateEmail = (users, newemail, callback) => {
    //     db.collection('users').find({ email: users.email }).toArray()
    //         .then((result) => {
    //             if (result.length > 0) {
    //                 const user = result[0];
    //                 const dbPassword = user.password;
    //                 bcrypt.compare(users.password, dbPassword).then((match) => {
    //                     if (!match) {
    //                         console.log("user credentials not matched");
    //                         callback([]);
    //                     } else {
    //                         db.collection('users').updateOne({ email: users.email }, { $set: { email: newemail } })
    //                             .then(() => {
    //                                 callback(result);
    //                             })
    //                             .catch((updateErr) => {
    //                                 console.log('Error updating users email:', updateErr);
    //                             });
    //                     }
    //                 });
    //             } else {
    //                 console.log('User not found.');
    //                 callback([]);
    //             }
    //         })
    //         .catch((err) => {
    //             console.log('Error:', err);
    //             callback([]);
    //         });
    // }
    // UPDATE EMAIL API
    this.updateEmail = async (users, newemail, callback) => {
        try {
            const result = await db.collection('users').find({ email: users.email }).toArray();
            if (result.length > 0) {
                const user = result[0];
                const dbPassword = user.password;
                const match = await bcrypt.compare(users.password, dbPassword);
                if (!match) {
                    console.log('user credentials not matched');
                    return [];
                } else {
                    await db.collection('users').updateOne({ email: users.email }, { $set: { email: newemail } });
                    callback(result)
                    return result;
                }
            } else {
                console.log('User not found.');
                return [];
            }
        } catch (err) {
            console.log('Error:', err);
            return [];
        }
    };







    // //UPDATE location API
    // this.updateLocation = (users, newLocation, callback) => {
    //     db.collection('users').find({ email: users.email }).toArray()
    //         .then((result) => {
    //             if (result.length > 0) {
    //                 const user = result[0];
    //                 const dbPassword = user.password;
    //                 bcrypt.compare(users.password, dbPassword).then((match) => {
    //                     if (!match) {
    //                         console.log("user credentials not matched");
    //                         callback([]);
    //                     } else {
    //                         db.collection('users').updateOne({ email: users.email }, { $set: { location: newLocation } })
    //                             .then(() => {
    //                                 callback(result);
    //                             })
    //                             .catch((updateErr) => {
    //                                 console.log('Error updating users location:', updateErr);
    //                             });
    //                     }
    //                 });
    //             } else {
    //                 console.log('User not found.');
    //                 callback([]);
    //             }
    //         })
    //         .catch((err) => {
    //             console.log('Error:', err);
    //             callback([]);
    //         });
    // }
    // UPDATE location API
    this.updateLocation = async (users, newLocation, callback) => {
        try {
            const result = await db.collection('users').find({ email: users.email }).toArray();
            if (result.length > 0) {
                const user = result[0];
                const dbPassword = user.password;
                const match = await bcrypt.compare(users.password, dbPassword);
                if (!match) {
                    console.log("user credentials not matched");
                    callback([]);
                } else {
                    await db.collection('users').updateOne({ email: users.email }, { $set: { location: newLocation } });
                    callback(result);
                }
            } else {
                console.log('User not found.');
                callback([]);
            }
        } catch (err) {
            console.log('Error:', err);
            callback([]);
        }
    };







    // //get User Details With Photos
    // this.getUserDetailsWithPhotos = (callback) => {
    //     db.collection("users").aggregate([
    //         {
    //             $lookup: {
    //                 from: "userphotos",
    //                 localField: "email",
    //                 foreignField: "email",
    //                 as: "Details",
    //             },
    //         },
    //     ])
    //         .toArray()
    //         .then((data) => {
    //             callback(data);
    //             console.log(data)
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //             callback([]);
    //         })
    // }
    // get User Details With Photos
    this.getUserDetailsWithPhotos = async (callback) => {
        try {
            const data = await db.collection("users").aggregate([
                {
                    $lookup: {
                        from: "userphotos",
                        localField: "email",
                        foreignField: "email",
                        as: "Details",
                    },
                },
            ]).toArray();
            console.log(data);
            callback(data);
            return data;
        } catch (err) {
            console.error(err);
            return [];
        }
    };





    // //getting userprofile details from user
    // this.UserProfile = (profilequestions, accessToken, callback) => {
    //     db.collection("profilequestions").find().toArray()
    //         .then((val) => {
    //             console.log(val);
    //             var result = val;
    //             let max_id = 0;
    //             if (result.length > 0) {
    //                 max_id = Math.max(...result.map((row) => row._id));
    //             }
    //             profilequestions._id = max_id + 1;

    //             let flag = 1;
    //             if (result.length > 0) {
    //                 for (let row of result) {
    //                     if (profilequestions.userEmail == row.userEmail) {
    //                         flag = 0;
    //                         break;
    //                     }
    //                 }
    //             }
    //             let uuid = crypto.randomUUID();
    //             if (flag == 1) {
    //                 profilequestions.uuid = uuid
    //                 profilequestions.role = "user"
    //                 profilequestions.dt = new Date();
    //                 profilequestions.token = accessToken;
    //                 db.collection("profilequestions").insertOne(profilequestions, (err) => {
    //                     if (err) {
    //                         console.log(err);
    //                         callback(false);
    //                     } else {
    //                         callback(true)
    //                     }
    //                 });
    //             } else {
    //                 callback(false);
    //             }
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //             callback(false);
    //         });
    // }
    // getting userprofile details from user
    this.UserProfile = async (profilequestions, accessToken, callback) => {
        try {
            const val = await db.collection("profilequestions").find().toArray();
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
                profilequestions.uuid = uuid;
                profilequestions.role = "user";
                profilequestions.dt = new Date();
                profilequestions.token = accessToken;

                await db.collection("profilequestions").insertOne(profilequestions);

                callback(true)
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    };







    // //getUserDetailsWithProfileQuestions
    // this.getUserProfileQuestions = (callback) => {
    //     db.collection("users").aggregate([
    //         {
    //             $lookup: {
    //                 from: "profilequestions",
    //                 localField: "email",
    //                 foreignField: "userEmail",
    //                 as: "Details",
    //             },
    //         },
    //     ])
    //         .toArray()
    //         .then((data) => {
    //             callback(data);
    //             console.log(data)
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //             callback([]);
    //         })
    // }
    // getUserDetailsWithProfileQuestions
    this.getUserProfileQuestions = async (callback) => {
        try {
            const data = await db.collection("users").aggregate([
                {
                    $lookup: {
                        from: "profilequestions",
                        localField: "email",
                        foreignField: "userEmail",
                        as: "Details",
                    },
                },
            ]).toArray();
            console.log(data);
            callback(data)
            return data;
        } catch (err) {
            console.log(err);
            return [];
        }
    };







    // //edit Bio in user Profile
    // this.EditProfileBio = (profilequestions, Bio, callback) => {
    //     db.collection("profilequestions").find({ userEmail: profilequestions.userEmail }).toArray()
    //         .then((result) => {
    //             console.log(result)
    //             if (result.length > 0) {
    //                 db.collection('profilequestions').updateOne({ userEmail: profilequestions.userEmail }, { $set: { Bio: Bio } })
    //                     .then(() => {
    //                         console.log('user Bio updated successfully');
    //                         callback(result);
    //                     })
    //                     .catch((updateErr) => {
    //                         console.log('Error while updating user bio', updateErr);
    //                         callback([]);
    //                     });
    //             } else {
    //                 console.log('user profile not found.');
    //                 callback([]);
    //             }
    //         })
    //         .catch((err) => {
    //             console.log('Error:', err);
    //             callback([]);
    //         });
    // }
    // Edit Bio in user Profile
    this.EditProfileBio = async (profilequestions, Bio, callback) => {
        try {
            const result = await db.collection("profilequestions").find({ userEmail: profilequestions.userEmail }).toArray();
            console.log(result);

            if (result.length > 0) {
                await db.collection('profilequestions').updateOne({ userEmail: profilequestions.userEmail }, { $set: { Bio: Bio } });
                console.log('user Bio updated successfully');
                callback(result);
            } else {
                console.log('user profile not found.');
                callback([]);
            }
        } catch (err) {
            console.log('Error:', err);
            callback([]);
        }
    };






    // //edit Intrest in user Profile
    // this.EditProfileIntrest = (profilequestions, Intrest, callback) => {
    //     db.collection("profilequestions").find({ userEmail: profilequestions.userEmail }).toArray()
    //         .then((result) => {
    //             console.log(result)
    //             if (result.length > 0) {
    //                 db.collection('profilequestions').updateOne({ userEmail: profilequestions.userEmail }, { $set: { Intrest: Intrest } })
    //                     .then(() => {
    //                         console.log('user Intrest updated successfully');
    //                         callback(result);
    //                     })
    //                     .catch((updateErr) => {
    //                         console.log('Error while updating user Intrest', updateErr);
    //                         callback([]);
    //                     });
    //             } else {
    //                 console.log('user profile not found.');
    //                 callback([]);
    //             }
    //         })
    //         .catch((err) => {
    //             console.log('Error:', err);
    //             callback([]);
    //         });
    // }
    // Edit Interest in user Profile
    this.EditProfileInterest = async (profilequestions, Intrest, callback) => {
        try {
            const result = await db.collection("profilequestions").find({ userEmail: profilequestions.userEmail }).toArray();

            if (result.length > 0) {
                await db.collection('profilequestions').updateOne({ userEmail: profilequestions.userEmail }, { $set: { Intrest: Intrest } });
                console.log('User Interest updated successfully');
                callback(result)
                return result;
            } else {
                console.log('User profile not found.');
                return [];
            }
        } catch (err) {
            console.log('Error:', err);
            return [];
        }
    }






    // //edit Language in user Profile
    // this.EditProfileLanguage = (profilequestions, Language, callback) => {
    //     db.collection("profilequestions").find({ userEmail: profilequestions.userEmail }).toArray()
    //         .then((result) => {
    //             console.log(result)
    //             if (result.length > 0) {
    //                 db.collection('profilequestions').updateOne({ userEmail: profilequestions.userEmail }, { $set: { Language: Language } })
    //                     .then(() => {
    //                         console.log('user Language updated successfully');
    //                         callback(result);
    //                     })
    //                     .catch((updateErr) => {
    //                         console.log('Error while updating user Language', updateErr);
    //                         callback([]);
    //                     });
    //             } else {
    //                 console.log('user profile not found.');
    //                 callback([]);
    //             }
    //         })
    //         .catch((err) => {
    //             console.log('Error:', err);
    //             callback([]);
    //         });
    // }
    // edit Language in user Profile
    this.EditProfileLanguage = async (profilequestions, Language, callback) => {
        try {
            const result = await db.collection("profilequestions").find({ userEmail: profilequestions.userEmail }).toArray();
            console.log(result);

            if (result.length > 0) {
                await db.collection('profilequestions').updateOne({ userEmail: profilequestions.userEmail }, { $set: { Language: Language } });
                console.log('user Language updated successfully');
                callback(result);
            } else {
                console.log('user profile not found.');
                callback([]);
            }
        } catch (err) {
            console.log('Error:', err);
            callback([]);
        }
    };





    // //edit Height in user Profile
    // this.EditProfileHeight = (profilequestions, Height, callback) => {
    //     db.collection("profilequestions").find({ userEmail: profilequestions.userEmail }).toArray()
    //         .then((result) => {
    //             console.log(result)
    //             if (result.length > 0) {
    //                 db.collection('profilequestions').updateOne({ userEmail: profilequestions.userEmail }, { $set: { Height: Height } })
    //                     .then(() => {
    //                         console.log('user Height updated successfully');
    //                         callback(result);
    //                     })
    //                     .catch((updateErr) => {
    //                         console.log('Error while updating user Height', updateErr);
    //                         callback([]);
    //                     });
    //             } else {
    //                 console.log('user profile not found.');
    //                 callback([]);
    //             }
    //         })
    //         .catch((err) => {
    //             console.log('Error:', err);
    //             callback([]);
    //         });
    // }
    // edit Height in user Profile
    this.EditProfileHeight = async (profilequestions, Height, callback) => {
        try {
            const result = await db.collection("profilequestions").find({ userEmail: profilequestions.userEmail }).toArray();

            if (result.length > 0) {
                await db.collection('profilequestions').updateOne({ userEmail: profilequestions.userEmail }, { $set: { Height: Height } });
                console.log('user Height updated successfully');
                callback(result)
                return result;
            } else {
                console.log('user profile not found.');
                return [];
            }
        } catch (err) {
            console.log('Error:', err);
            return [];
        }
    };






    // //edit Work in user Profile
    // this.EditProfileWork = (profilequestions, Work, callback) => {
    //     db.collection("profilequestions").find({ userEmail: profilequestions.userEmail }).toArray()
    //         .then((result) => {
    //             console.log(result)
    //             if (result.length > 0) {
    //                 db.collection('profilequestions').updateOne({ userEmail: profilequestions.userEmail }, { $set: { Work: Work } })
    //                     .then(() => {
    //                         console.log('user work updated successfully');
    //                         callback(result);
    //                     })
    //                     .catch((updateErr) => {
    //                         console.log('Error while updating user work', updateErr);
    //                         callback([]);
    //                     });
    //             } else {
    //                 console.log('user profile not found.');
    //                 callback([]);
    //             }
    //         })
    //         .catch((err) => {
    //             console.log('Error:', err);
    //             callback([]);
    //         });
    // }
    // edit Work in user Profile
    this.EditProfileWork = async (profilequestions, Work, callback) => {
        try {
            const result = await db.collection("profilequestions").find({ userEmail: profilequestions.userEmail }).toArray();
            console.log(result)
            if (result.length > 0) {
                await db.collection('profilequestions').updateOne({ userEmail: profilequestions.userEmail }, { $set: { Work: Work } });
                console.log('user work updated successfully');
                callback(result)
                return result;
            } else {
                console.log('user profile not found.');
                return [];
            }
        } catch (err) {
            console.log('Error:', err);
            return [];
        }
    }







    // //delete profile api
    // this.DeleteProfile = (userEmail, callback) => {
    //     db.collection('profilequestions').deleteOne({ userEmail: userEmail })
    //         .then((result) => {
    //             if (result.deletedCount > 0) {
    //                 console.log('Profile deleted successfully.');
    //                 callback(true);
    //             } else {
    //                 console.log('Profile not found.');
    //                 callback(false);
    //             }
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //             callback(false);
    //         });
    // };
    // delete profile api
    this.DeleteProfile = async (userEmail, callback) => {
        try {
            const result = await db.collection('profilequestions').deleteOne({ userEmail: userEmail });

            if (result.deletedCount > 0) {
                console.log('Profile deleted successfully.');
                callback(true);
            } else {
                console.log('Profile not found.');
                callback(false);
            }
        } catch (err) {
            console.log(err);
            callback(false);
        }
    };








    // //update api of star sign
    // this.EditProfileStarSign = (profilequestions, newStarSign, callback) => {
    //     db.collection("profilequestions").find({ userEmail: profilequestions.userEmail }).toArray()
    //         .then((result) => {
    //             console.log(result)
    //             if (result.length > 0) {
    //                 db.collection('profilequestions').updateOne({ userEmail: profilequestions.userEmail }, { $set: { StarSign: newStarSign } })
    //                     .then(() => {
    //                         console.log('user newStarSign updated successfully');
    //                         callback(result);
    //                     })
    //                     .catch((updateErr) => {
    //                         console.log('Error while updating user newStarSign', updateErr);
    //                         callback([]);
    //                     });
    //             } else {
    //                 console.log('user profile not found.');
    //                 callback([]);
    //             }
    //         })
    //         .catch((err) => {
    //             console.log('Error:', err);
    //             callback([]);
    //         });
    // }
    this.EditProfileStarSign = async (profilequestions, newStarSign, callback) => {
        try {
            const result = await db.collection("profilequestions").find({ userEmail: profilequestions.userEmail }).toArray();

            console.log(result);

            if (result.length > 0) {
                await db.collection('profilequestions').updateOne({ userEmail: profilequestions.userEmail }, { $set: { StarSign: newStarSign } });
                console.log('user newStarSign updated successfully');
                callback(result)
                return result;
            } else {
                console.log('user profile not found.');
                return [];
            }
        } catch (error) {
            console.log('Error:', error);
            return [];
        }
    };






    // //create user preference model
    // this.userPreferences = (preferences, min_age, max_age, accessToken, callback) => {
    //     db.collection("preferences").find().toArray()
    //         .then((val) => {
    //             console.log(val);
    //             var result = val;
    //             let max_id = 0;
    //             if (result.length > 0) {
    //                 max_id = Math.max(...result.map((row) => row._id));
    //             }
    //             preferences._id = max_id + 1;

    //             let flag = 1;
    //             if (result.length > 0) {
    //                 for (let row of result) {
    //                     if (preferences.userEmail == row.userEmail) {
    //                         flag = 0;
    //                         break;
    //                     }
    //                 }
    //             }
    //             let uuid = crypto.randomUUID();
    //             if (flag == 1) {
    //                 preferences.uuid = uuid
    //                 preferences.min_age = min_age
    //                 preferences.max_age = max_age
    //                 preferences.role = "user"
    //                 preferences.dt = new Date();
    //                 preferences.token = accessToken;
    //                 db.collection("preferences").insertOne(preferences, (err) => {
    //                     if (err) {
    //                         console.log(err);
    //                         callback(false);
    //                     } else {
    //                         callback(true)
    //                     }
    //                 });
    //             } else {
    //                 callback(false);
    //             }
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //             callback(false);
    //         });
    // }
    // create user preference model
    this.userPreferences = async (preferences, min_age, max_age, accessToken, callback) => {
        try {
            const val = await db.collection("preferences").find().toArray();
            console.log(val);
            let result = val;
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

                await db.collection("preferences").insertOne(preferences);

                callback(true);
            } else {
                callback(false);
            }
        } catch (err) {
            console.log(err);
            callback(false);
        }
    }





    // //update min and max age 
    // this.update_Min_Max_Age = (preferences, newMinAge, newMaxAge, callback) => {
    //     db.collection("preferences").find({ userEmail: preferences.userEmail }).toArray()
    //         .then((result) => {
    //             console.log(result)
    //             if (result.length > 0) {
    //                 db.collection('preferences').updateOne({ userEmail: preferences.userEmail }, { $set: { min_age: newMinAge, max_age: newMaxAge } })
    //                     .then(() => {
    //                         console.log('new min and max Age updated successfully');
    //                         callback(result);
    //                     })
    //                     .catch((updateErr) => {
    //                         console.log('Error while updating new Min and max Age', updateErr);
    //                         callback([]);
    //                     });
    //             } else {
    //                 console.log('user preference not found.');
    //                 callback([]);
    //             }
    //         })
    //         .catch((err) => {
    //             console.log('Error:', err);
    //             callback([]);
    //         });
    // }
    //update min and max age 
    this.update_Min_Max_Age = async (preferences, newMinAge, newMaxAge, callback) => {
        try {
            const result = await db.collection("preferences").find({ userEmail: preferences.userEmail }).toArray();
            console.log(result);

            if (result.length > 0) {
                await db.collection('preferences').updateOne({ userEmail: preferences.userEmail }, { $set: { min_age: newMinAge, max_age: newMaxAge } });
                console.log('new min and max Age updated successfully');
                callback(result)
                return result;
            } else {
                console.log('user preference not found.');
                return [];
            }
        } catch (err) {
            console.log('Error:', err);
            return [];
        }
    }





    // //Update Distance api
    // this.updateDistanceRadius = (preferences, newDistanceRadius, callback) => {
    //     db.collection("preferences").find({ userEmail: preferences.userEmail }).toArray()
    //         .then((result) => {
    //             console.log(result)
    //             if (result.length > 0) {
    //                 db.collection('preferences').updateOne({ userEmail: preferences.userEmail }, { $set: { DistanceRadius: newDistanceRadius } })
    //                     .then(() => {
    //                         console.log('new Distance updated successfully');
    //                         callback(result);
    //                     })
    //                     .catch((updateErr) => {
    //                         console.log('Error while updating new Distance', updateErr);
    //                         callback([]);
    //                     });
    //             } else {
    //                 console.log('user preference not found.');
    //                 callback([]);
    //             }
    //         })
    //         .catch((err) => {
    //             console.log('Error:', err);
    //             callback([]);
    //         });
    // }
    // Update Distance api
    this.updateDistanceRadius = async (preferences, newDistanceRadius, callback) => {
        try {
            const result = await db.collection("preferences").find({ userEmail: preferences.userEmail }).toArray();

            console.log(result);

            if (result.length > 0) {
                await db.collection('preferences').updateOne({ userEmail: preferences.userEmail }, { $set: { DistanceRadius: newDistanceRadius } });

                console.log('new Distance updated successfully');
                callback(result);
            } else {
                console.log('user preference not found.');
                callback([]);
            }
        } catch (err) {
            console.log('Error:', err);
            callback([]);
        }
    }





    // // user like someone api
    // this.UserLikeSomeOne = (userlikesomeones, callback) => {
    //     db.collection("userlikesomeones").find().toArray()
    //         .then((val) => {
    //             console.log(val);
    //             var result = val;
    //             if (result.length > 0) {
    //                 var max_id = result[0]._id;
    //                 for (let row of result) {
    //                     if (max_id < row._id) {
    //                         max_id = row._id;
    //                     }
    //                 }
    //                 userlikesomeones._id = max_id + 1;
    //             } else {
    //                 userlikesomeones._id = 1;
    //             }
    //             var flag = 1;
    //             if (result.length > 0) {
    //                 for (let row of result) {
    //                     if (userlikesomeones._id == row._id) {
    //                         flag = 0;
    //                         break;
    //                     }
    //                 }
    //             }

    //             let uuid = crypto.randomUUID();

    //             if (flag == 1) {
    //                 userlikesomeones.isLiked = true;
    //                 userlikesomeones.uuid = uuid;
    //                 userlikesomeones.dt = Date();
    //                 db.collection("userlikesomeones").insertOne(userlikesomeones, (err) => {
    //                     if (err) {
    //                         console.log(err);
    //                         if (callback) {
    //                             callback(false);
    //                         }
    //                     } else {
    //                         db.collection("users").updateOne({ email: userlikesomeones.UserEmail }, { $set: { isLiked: true } })
    //                             .then(() => {
    //                                 if (callback) {
    //                                     callback(true);
    //                                 }
    //                             })
    //                             .catch((err) => {
    //                                 console.log(err);
    //                                 if (callback) {
    //                                     callback(false);
    //                                 }
    //                             });
    //                     }
    //                 });
    //             } else {
    //                 if (callback) {
    //                     callback(false);
    //                 }
    //             }
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //             if (callback) {
    //                 callback(false);
    //             }
    //         });
    // };
    // user like someone api
    this.UserLikeSomeOne = async (userlikesomeones, callback) => {
        try {
            const val = await db.collection("userlikesomeones").find().toArray();

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

                await db.collection("userlikesomeones").insertOne(userlikesomeones);

                await db.collection("users").updateOne({ email: userlikesomeones.UserEmail }, { $set: { isLiked: true } });

                if (callback) {
                    callback(true);
                }
            } else {
                if (callback) {
                    callback(false);
                }
            }
        } catch (err) {
            console.log(err);
            if (callback) {
                callback(false);
            }
        }
    };








    // // user Like Retreve  api
    // this.RetreveLike = (userlikesomeones, callback) => {
    //     db.collection('userlikesomeones').deleteOne({ UserEmail: userlikesomeones.UserEmail, LikedTo: userlikesomeones.LikedTo })
    //         .then((result) => {
    //             if (result.deletedCount > 0) {
    //                 db.collection("users").updateOne({ email: userlikesomeones.UserEmail }, { $set: { isLiked: false } })
    //                     .then(() => {
    //                         if (callback) {
    //                             callback(true);
    //                         }
    //                     })
    //                     .catch((err) => {
    //                         console.log(err);
    //                         if (callback) {
    //                             callback(false);
    //                         }
    //                     });

    //             } else {
    //                 console.log('User not found.');
    //             }
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // }
    // user Like Retreve api
    this.RetreveLike = async (userlikesomeones, callback) => {
        try {
            const result = await db.collection('userlikesomeones').deleteOne({ UserEmail: userlikesomeones.UserEmail, LikedTo: userlikesomeones.LikedTo });

            if (result.deletedCount > 0) {
                await db.collection("users").updateOne({ email: userlikesomeones.UserEmail }, { $set: { isLiked: false } });
                if (callback) {
                    callback(true);
                }
            } else {
                console.log('User not found.');
                if (callback) {
                    callback(false);
                }
            }
        } catch (err) {
            console.log(err);
            if (callback) {
                callback(false);
            }
        }
    }






    // //Useapir DisLike 
    // this.UserDisLikeSomeOne = (userdislikesomeones, callback) => {
    //     db.collection("userdislikesomeones").find().toArray()
    //         .then((val) => {
    //             console.log(val);
    //             var result = val;
    //             if (result.length > 0) {
    //                 var max_id = result[0]._id;
    //                 for (let row of result) {
    //                     if (max_id < row._id) {
    //                         max_id = row._id;
    //                     }
    //                 }
    //                 userdislikesomeones._id = max_id + 1;
    //             } else {
    //                 userdislikesomeones._id = 1;
    //             }
    //             var flag = 1;
    //             if (result.length > 0) {
    //                 for (let row of result) {
    //                     if (userdislikesomeones._id == row._id) {
    //                         flag = 0;
    //                         break;
    //                     }
    //                 }
    //             }

    //             let uuid = crypto.randomUUID();

    //             if (flag == 1) {
    //                 userdislikesomeones.isDisLiked = true;
    //                 userdislikesomeones.uuid = uuid;
    //                 userdislikesomeones.dt = Date();
    //                 db.collection("userdislikesomeones").insertOne(userdislikesomeones, (err) => {
    //                     if (err) {
    //                         console.log(err);
    //                         if (callback) {
    //                             callback(false);
    //                         }
    //                     } else {
    //                         db.collection("users").updateOne({ email: userdislikesomeones.UserEmail }, { $set: { isDisLiked: true } })
    //                             .then(() => {
    //                                 if (callback) {
    //                                     callback(true);
    //                                 }
    //                             })
    //                             .catch((err) => {
    //                                 console.log(err);
    //                                 if (callback) {
    //                                     callback(false);
    //                                 }
    //                             });
    //                     }
    //                 });
    //             } else {
    //                 if (callback) {
    //                     callback(false);
    //                 }
    //             }
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //             if (callback) {
    //                 callback(false);
    //             }
    //         });
    // }
    // User DisLike 
    this.UserDisLikeSomeOne = async (userdislikesomeones, callback) => {
        try {
            const val = await db.collection("userdislikesomeones").find().toArray();
            console.log(val);

            let result = val;
            if (result.length > 0) {
                let max_id = result[0]._id;
                for (let row of result) {
                    if (max_id < row._id) {
                        max_id = row._id;
                    }
                }
                userdislikesomeones._id = max_id + 1;
            } else {
                userdislikesomeones._id = 1;
            }

            let flag = 1;
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

                await db.collection("userdislikesomeones").insertOne(userdislikesomeones);

                await db.collection("users").updateOne({ email: userdislikesomeones.UserEmail }, { $set: { isDisLiked: true } });

                if (callback) {
                    callback(true);
                }
            } else {
                if (callback) {
                    callback(false);
                }
            }
        } catch (err) {
            console.error(err);
            if (callback) {
                callback(false);
            }
        }
    }








    // // user DisLike Retreve  api
    // this.RetreveDisLike = (userdislikesomeones, callback) => {
    //     db.collection('userdislikesomeones').deleteOne({ UserEmail: userdislikesomeones.UserEmail, DisLikedTo: userdislikesomeones.DisLikedTo })
    //         .then((result) => {
    //             if (result.deletedCount > 0) {
    //                 db.collection("users").updateOne({ email: userdislikesomeones.UserEmail }, { $set: { isDisLiked: false } })
    //                     .then(() => {
    //                         if (callback) {
    //                             callback(true);
    //                         }
    //                     })
    //                     .catch((err) => {
    //                         console.log(err);
    //                         if (callback) {
    //                             callback(false);
    //                         }
    //                     });

    //             } else {
    //                 console.log('User not found.');
    //             }
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // }
    // user DisLike Retrieve api
    this.RetreveDisLike = async (userdislikesomeones, callback) => {
        try {
            const result = await db.collection('userdislikesomeones').deleteOne({ UserEmail: userdislikesomeones.UserEmail, DisLikedTo: userdislikesomeones.DisLikedTo });

            if (result.deletedCount > 0) {
                await db.collection("users").updateOne({ email: userdislikesomeones.UserEmail }, { $set: { isDisLiked: false } });

                if (callback) {
                    callback(true);
                }
            } else {
                console.log('User not found.');
                if (callback) {
                    callback(false);
                }
            }
        } catch (err) {
            console.error(err);
            if (callback) {
                callback(false);
            }
        }
    }








    // //user SuperLike Someone api
    // this.UserSuperLikeSomeOne = (usersuperlikesomeones, callback) => {
    //     db.collection("usersuperlikesomeones").find().toArray()
    //         .then((val) => {
    //             console.log(val);
    //             var result = val;
    //             if (result.length > 0) {
    //                 var max_id = result[0]._id;
    //                 for (let row of result) {
    //                     if (max_id < row._id) {
    //                         max_id = row._id;
    //                     }
    //                 }
    //                 usersuperlikesomeones._id = max_id + 1;
    //             } else {
    //                 usersuperlikesomeones._id = 1;
    //             }
    //             var flag = 1;
    //             if (result.length > 0) {
    //                 for (let row of result) {
    //                     if (usersuperlikesomeones._id == row._id) {
    //                         flag = 0;
    //                         break;
    //                     }
    //                 }
    //             }

    //             let uuid = crypto.randomUUID();

    //             if (flag == 1) {
    //                 usersuperlikesomeones.isSuperDisLiked = true;
    //                 usersuperlikesomeones.uuid = uuid;
    //                 usersuperlikesomeones.dt = Date();
    //                 db.collection("usersuperlikesomeones").insertOne(usersuperlikesomeones, (err) => {
    //                     if (err) {
    //                         console.log(err);
    //                         if (callback) {
    //                             callback(false);
    //                         }
    //                     } else {
    //                         db.collection("users").updateOne({ email: usersuperlikesomeones.UserEmail }, { $set: { isSuperLiked: true } })
    //                             .then(() => {
    //                                 if (callback) {
    //                                     callback(true);
    //                                 }
    //                             })
    //                             .catch((err) => {
    //                                 console.log(err);
    //                                 if (callback) {
    //                                     callback(false);
    //                                 }
    //                             });
    //                     }
    //                 });
    //             } else {
    //                 if (callback) {
    //                     callback(false);
    //                 }
    //             }
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //             if (callback) {
    //                 callback(false);
    //             }
    //         });
    // }
    // user SuperLike Someone api
    this.UserSuperLikeSomeOne = async (usersuperlikesomeones, callback) => {
        try {
            const val = await db.collection("usersuperlikesomeones").find().toArray();
            console.log(val);

            let result = val;
            if (result.length > 0) {
                let max_id = result[0]._id;
                for (let row of result) {
                    if (max_id < row._id) {
                        max_id = row._id;
                    }
                }
                usersuperlikesomeones._id = max_id + 1;
            } else {
                usersuperlikesomeones._id = 1;
            }

            let flag = 1;
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

                await db.collection("usersuperlikesomeones").insertOne(usersuperlikesomeones);

                await db.collection("users").updateOne({ email: usersuperlikesomeones.UserEmail }, { $set: { isSuperLiked: true } });

                callback(true)
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    };






    // //get liked user api
    // this.getLikedUser = (callback) => {
    //     db.collection("users")
    //         .aggregate([
    //             {
    //                 $lookup: {
    //                     from: "userlikesomeones",
    //                     localField: "email",
    //                     foreignField: "UserEmail",
    //                     as: "Details",
    //                 },
    //             },

    //         ]).toArray()
    //         .then((data) => {
    //             callback(data);
    //             console.log(data)
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         })
    // }
    // get liked user api
    this.getLikedUser = async (callback) => {
        try {
            const data = await db.collection("users")
                .aggregate([
                    {
                        $lookup: {
                            from: "userlikesomeones",
                            localField: "email",
                            foreignField: "UserEmail",
                            as: "Details",
                        },
                    },
                ]).toArray();

            console.log(data);
            callback(data)
            return data;
        } catch (err) {
            console.log(err);
            throw err;
        }
    };







    // // get user like Count api
    // this.getLikeCount = (userlikesomeones, callback) => {
    //     db.collection("userlikesomeones").aggregate([
    //         {
    //             $match: { UserEmail: userlikesomeones.UserEmail }
    //         },
    //         {
    //             $count: "mycount"
    //         },
    //     ]).toArray()
    //         .then((data) => {
    //             callback(data);
    //             console.log(data);
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // }
    // get user like Count api
    this.getLikeCount = async (userlikesomeones, callback) => {
        try {
            const data = await db.collection("userlikesomeones").aggregate([
                {
                    $match: { UserEmail: userlikesomeones.UserEmail }
                },
                {
                    $count: "mycount"
                },
            ]).toArray();

            console.log(data);
            callback(data)
            return data;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }









    // // get user Dislike Count api
    // this.getDisLikeCount = (userdislikesomeones, callback) => {
    //     db.collection("userdislikesomeones").aggregate([
    //         {
    //             $match: { UserEmail: userdislikesomeones.UserEmail }
    //         },
    //         {
    //             $count: "mycount"
    //         },
    //     ]).toArray()
    //         .then((data) => {
    //             callback(data);
    //             console.log(data);
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // }
    // get user Dislike Count api
    this.getDisLikeCount = async (userdislikesomeones, callback) => {
        try {
            const data = await db.collection("userdislikesomeones").aggregate([
                {
                    $match: { UserEmail: userdislikesomeones.UserEmail }
                },
                {
                    $count: "mycount"
                },
            ]).toArray();

            callback(data);
            console.log(data);
        } catch (err) {
            console.log(err);
        }
    }









    // // get user Dislike Count api
    // this.getSuperLikeCount = (usersuperlikesomeones, callback) => {
    //     db.collection("usersuperlikesomeones").aggregate([
    //         {
    //             $match: { UserEmail: usersuperlikesomeones.UserEmail }
    //         },
    //         {
    //             $count: "mycount"
    //         },
    //     ]).toArray()
    //         .then((data) => {
    //             callback(data);
    //             console.log(data);
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // }

    // get user Dislike Count api
    this.getSuperLikeCount = async (usersuperlikesomeones, callback) => {
        try {
            const data = await db.collection("usersuperlikesomeones").aggregate([
                {
                    $match: { UserEmail: usersuperlikesomeones.UserEmail }
                },
                {
                    $count: "mycount"
                },
            ]).toArray();

            callback(data);
            console.log(data);
        } catch (err) {
            console.log(err);
        }
    };










    // // get user Dislike Count api
    // this.getCommentCount = (commentsomeones, callback) => {
    //     db.collection("commentsomeones").aggregate([
    //         {
    //             $match: { UserEmail: commentsomeones.UserEmail }
    //         },
    //         {
    //             $count: "mycount"
    //         },
    //     ]).toArray()
    //         .then((data) => {
    //             callback(data);
    //             console.log(data);
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // }
    // get user Dislike Count api
    this.getCommentCount = async (commentsomeones, callback) => {
        try {
            const data = await db.collection("commentsomeones").aggregate([
                {
                    $match: { UserEmail: commentsomeones.UserEmail }
                },
                {
                    $count: "mycount"
                },
            ]).toArray();

            callback(data);
            console.log(data);
        } catch (err) {
            console.log(err);
        }
    }











    // //comment on user profile api
    // this.CommentUser = (commentsomeones, callback) => {
    //     db.collection("commentsomeones").find().toArray()
    //         .then((val) => {
    //             console.log(val);
    //             var result = val;
    //             if (result.length > 0) {
    //                 var max_id = result[0]._id;
    //                 for (let row of result) {
    //                     if (max_id < row._id) {
    //                         max_id = row._id;
    //                     }
    //                 }
    //                 commentsomeones._id = max_id + 1;
    //             } else {
    //                 commentsomeones._id = 1;
    //             }
    //             var flag = 1;
    //             if (result.length > 0) {
    //                 for (let row of result) {
    //                     if (commentsomeones._id == row._id) {
    //                         flag = 0;
    //                         break;
    //                     }
    //                 }
    //             }

    //             let uuid = crypto.randomUUID();

    //             if (flag == 1) {
    //                 commentsomeones.uuid = uuid;
    //                 commentsomeones.dt = Date();
    //                 db.collection("commentsomeones").insertOne(commentsomeones, (err) => {
    //                     if (err) {
    //                         console.log(err);
    //                         if (callback) {
    //                             callback(false);
    //                         }
    //                     } else {
    //                         callback(true);
    //                     }
    //                 });
    //             } else {
    //                 if (callback) {
    //                     callback(false);
    //                 }
    //             }
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //             if (callback) {
    //                 callback(false);
    //             }
    //         });
    // }
    //comment on user profile api
    this.CommentUser = async (commentsomeones, callback) => {
        try {
            const result = await db.collection("commentsomeones").find().toArray();
            console.log(result);

            let max_id = 1;
            if (result.length > 0) {
                max_id = Math.max(...result.map(row => row._id)) + 1;
            }

            let flag = 1;
            if (result.length > 0) {
                flag = result.every(row => commentsomeones._id !== row._id);
            }

            const uuid = crypto.randomUUID();

            if (flag) {
                commentsomeones._id = max_id;
                commentsomeones.uuid = uuid;
                commentsomeones.dt = Date();

                await db.collection("commentsomeones").insertOne(commentsomeones);
                if (callback) {
                    callback(true);
                }
            } else {
                if (callback) {
                    callback(false);
                }
            }
        } catch (err) {
            console.log(err);
            if (callback) {
                callback(false);
            }
        }
    }







}

module.exports = new indexmodel();


