const { db, clubs } = require('./connection');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const fast2sms = require('fast-two-sms');
const createTokens = require('../utils/JWT');
const { EMAIL, PASS, authOTPKEY } = require('../constants/constants');
const otpGenerator = require('otp-generator');


function clubmodel() {


    //REGISTER CLUB API
    this.registerClub = (clubs, Club_Banner, Club_Docs, Owner_Aadhar, Owner_DP, accessToken, password, callback) => {
        db.collection("clubs").find().toArray()
            .then((val) => {
                console.log(val);
                var result = val;
                let max_id = 0;
                if (result.length > 0) {
                    max_id = Math.max(...result.map((row) => row._id));
                }
                clubs._id = max_id + 1;

                let flag = 1;
                if (result.length > 0) {
                    for (let row of result) {
                        if (clubs.email == row.email) {
                            flag = 0;
                            break;
                        }
                    }
                }
                let uuid = crypto.randomUUID();
                if (flag == 1) {
                    clubs.uuid = uuid;
                    clubs.Club_Banner = Club_Banner;
                    clubs.Club_Docs = Club_Docs;
                    clubs.Owner_Aadhar = Owner_Aadhar;
                    clubs.Owner_DP = Owner_DP;
                    clubs.status = 0;
                    clubs.role = "Club Owner";
                    clubs.dt = new Date();
                    clubs.Isactive = false;
                    clubs.IsEmailVerified = false;
                    clubs.token = accessToken;
                    clubs.otp = '';
                    bcrypt.hash(password, 10).then((hash) => {
                        clubs.password = hash;
                        db.collection("clubs").insertOne(clubs, (err) => {
                            if (err) {
                                console.log(err);
                                callback(false);
                            } else {
                                callback(true)
                            }
                        });
                    });
                } else {
                    callback(false);
                }
            })
            .catch((err) => {
                console.log(err);
                callback(false);
            });
    };






    // DELETE CLUB API
    this.clubDelete = (email, callback) => {
        db.collection('clubs').deleteOne({ email: email })
            .then((result) => {
                if (result.deletedCount > 0) {
                    callback(true); // Club deleted successfully
                } else {
                    console.log('Club not found.');
                    callback(false); // Club not found
                }
            }).catch((err) => {
                console.log(err);
                callback(false); // Error occurred
            });
    }






    // UPDATE CLUB_NAME API
    this.update_Club_name = (clubs, Clubnewname, callback) => {
        db.collection('clubs').find({ email: clubs.email }).toArray()
            .then((result) => {
                if (result.length > 0) {
                    const club = result[0];
                    const dbPassword = club.password;
                    bcrypt.compare(clubs.password, dbPassword).then((match) => {
                        if (!match) {
                            console.log("clubs credentials not matched");
                            callback([]);
                        } else {
                            db.collection('clubs').updateOne({ email: clubs.email }, { $set: { Club_name: Clubnewname } })
                                .then(() => {
                                    callback(result);
                                })
                                .catch((updateErr) => {
                                    console.log('Error updating clubs name :', updateErr);
                                });
                        }
                    });
                } else {
                    console.log('clubs not found.');
                    callback([]);
                }
            })
            .catch((err) => {
                console.log('Error:', err);
                callback([]);
            });
    }






    // update_Owner_name api
    this.update_Owner_name = (clubs, Owner_name, callback) => {
        db.collection('clubs').find({ email: clubs.email }).toArray()
            .then((result) => {
                if (result.length > 0) {
                    const club = result[0];
                    const dbPassword = club.password;
                    bcrypt.compare(clubs.password, dbPassword).then((match) => {
                        if (!match) {
                            console.log("clubs credentials not matched");
                            callback([]);
                        } else {
                            db.collection('clubs').updateOne({ email: clubs.email }, { $set: { Owner_name: Owner_name } })
                                .then(() => {
                                    callback(result);
                                })
                                .catch((updateErr) => {
                                    console.log('Error updating Owner name :', updateErr);
                                });
                        }
                    });
                } else {
                    console.log('clubs not found.');
                    callback([]);
                }
            })
            .catch((err) => {
                console.log('Error:', err);
                callback([]);
            });
    }








    //UPDATE Club PHONE API
    this.update_Club_Phone = (clubs, phone, callback) => {
        db.collection('clubs').find({ email: clubs.email }).toArray()
            .then((result) => {
                if (result.length > 0) {
                    const club = result[0];
                    const dbPassword = club.password;
                    bcrypt.compare(clubs.password, dbPassword).then((match) => {
                        if (!match) {
                            console.log("clubs credentials not matched");
                            callback([]);
                        } else {
                            db.collection('clubs').updateOne({ email: clubs.email }, { $set: { Phone: phone } })
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
                                        numbers: [clubs.Phone]
                                    };

                                    fast2sms.sendMessage(options)
                                        .then(() => {
                                            db.collection("clubs").updateOne({ Phone: clubs.Phone }, { $set: { otp: new_otp } })
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
                    console.log('clubs not found.');
                    callback([]);
                }
            })
            .catch((err) => {
                console.log('Error:', err);
                callback([]);
            });
    }







    //verify club owner phone
    this.verifyClub_phone = (clubs , otp, callback) => {
        db.collection('clubs').find({ phone: clubs.phone }).toArray()
            .then((result) => {
                if (result.length > 0) {
                    if (otp == users.otp) {
                        callback(result);
                        db.collection("users").updateOne({ phone: clubs.phone }, { $set: { otp: '' } })
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
    }








    //UPDATE EMAIL API
    this.updateClub_Email = (clubs, newemail, callback) => {
        db.collection('clubs').find({ email: clubs.email }).toArray()
            .then((result) => {
                if (result.length > 0) {
                    const club = result[0];
                    const dbPassword = club.password;
                    bcrypt.compare(clubs.password, dbPassword).then((match) => {
                        if (!match) {
                            console.log("user credentials not matched");
                            callback([]);
                        } else {
                            db.collection('clubs').updateOne({ email: clubs.email }, { $set: { email: newemail } })
                                .then(() => {
                                    callback(result);
                                })
                                .catch((updateErr) => {
                                    console.log('Error updating clubs email:', updateErr);
                                });
                        }
                    });
                } else {
                    console.log('clubs not found.');
                    callback([]);
                }
            })
            .catch((err) => {
                console.log('Error:', err);
                callback([]);
            });
    }







    //update Owner_DP in club model
    this.updateOwner_DP = (clubs, newemail, callback) => {
        db.collection('clubs').find({ email: clubs.email }).toArray()
            .then((result) => {
                if (result.length > 0) {
                    const club = result[0];
                    const dbPassword = club.password;
                    bcrypt.compare(clubs.password, dbPassword).then((match) => {
                        if (!match) {
                            console.log("user credentials not matched");
                            callback([]);
                        } else {
                            db.collection('clubs').updateOne({ email: clubs.email }, { $set: { email: newemail } })
                                .then(() => {
                                    callback(result);
                                })
                                .catch((updateErr) => {
                                    console.log('Error updating clubs email:', updateErr);
                                });
                        }
                    });
                } else {
                    console.log('clubs not found.');
                    callback([]);
                }
            })
            .catch((err) => {
                console.log('Error:', err);
                callback([]);
            });
    }







}

module.exports = new clubmodel();