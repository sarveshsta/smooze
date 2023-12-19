const { db, clubs } = require('./connection');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const twilio = require('twilio');
const crypto = require('crypto');
const createTokens = require('../utils/JWT');
const { EMAIL, PASS, authOTPKEY, SSID, AUth_TOKEN, PhoneNumber } = require('../constants/constants');
const otpGenerator = require('otp-generator');


function clubmodel() {


    // //REGISTER CLUB API
    // this.registerClub = (clubs, Club_Banner, Club_Docs, Owner_Aadhar, Owner_DP, accessToken, password, callback) => {
    //     db.collection("clubs").find().toArray()
    //         .then((val) => {
    //             console.log(val);
    //             var result = val;
    //             let max_id = 0;
    //             if (result.length > 0) {
    //                 max_id = Math.max(...result.map((row) => row._id));
    //             }
    //             clubs._id = max_id + 1;

    //             let flag = 1;
    //             if (result.length > 0) {
    //                 for (let row of result) {
    //                     if (clubs.email == row.email) {
    //                         flag = 0;
    //                         break;
    //                     }
    //                 }
    //             }
    //             let uuid = crypto.randomUUID();
    //             if (flag == 1) {
    //                 clubs.uuid = uuid;
    //                 clubs.Club_Banner = Club_Banner;
    //                 clubs.Club_Docs = Club_Docs;
    //                 clubs.Owner_Aadhar = Owner_Aadhar;
    //                 clubs.Owner_DP = Owner_DP;
    //                 clubs.status = 0;
    //                 clubs.role = "Club Owner";
    //                 clubs.dt = new Date();
    //                 clubs.Isactive = false;
    //                 clubs.IsEmailVerified = false;
    //                 clubs.token = accessToken;
    //                 clubs.otp = '';
    //                 bcrypt.hash(password, 10).then((hash) => {
    //                     clubs.password = hash;
    //                     db.collection("clubs").insertOne(clubs, (err) => {
    //                         if (err) {
    //                             console.log(err);
    //                             callback(false);
    //                         } else {
    //                             callback(true)
    //                         }
    //                     });
    //                 });
    //             } else {
    //                 callback(false);
    //             }
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //             callback(false);
    //         });
    // };






    // // DELETE CLUB API
    // this.clubDelete = (email, callback) => {
    //     db.collection('clubs').deleteOne({ email: email })
    //         .then((result) => {
    //             if (result.deletedCount > 0) {
    //                 callback(true); // Club deleted successfully
    //             } else {
    //                 console.log('Club not found.');
    //                 callback(false); // Club not found
    //             }
    //         }).catch((err) => {
    //             console.log(err);
    //             callback(false); // Error occurred
    //         });
    // }






    // // UPDATE CLUB_NAME API
    // this.update_Club_name = (clubs, Clubnewname, callback) => {
    //     db.collection('clubs').find({ email: clubs.email }).toArray()
    //         .then((result) => {
    //             if (result.length > 0) {
    //                 const club = result[0];
    //                 const dbPassword = club.password;
    //                 bcrypt.compare(clubs.password, dbPassword).then((match) => {
    //                     if (!match) {
    //                         console.log("clubs credentials not matched");
    //                         callback([]);
    //                     } else {
    //                         db.collection('clubs').updateOne({ email: clubs.email }, { $set: { Club_name: Clubnewname } })
    //                             .then(() => {
    //                                 callback(result);
    //                             })
    //                             .catch((updateErr) => {
    //                                 console.log('Error updating clubs name :', updateErr);
    //                             });
    //                     }
    //                 });
    //             } else {
    //                 console.log('clubs not found.');
    //                 callback([]);
    //             }
    //         })
    //         .catch((err) => {
    //             console.log('Error:', err);
    //             callback([]);
    //         });
    // }
    // REGISTER CLUB API
    this.registerClub = async (clubs, Club_Banner, Club_Docs, Owner_Aadhar, Owner_DP, accessToken, password, callback) => {
        try {
            const val = await db.collection("clubs").find().toArray();
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
                const hash = await bcrypt.hash(password, 10);
                clubs.password = hash;

                await db.collection("clubs").insertOne(clubs);
                callback(true);
            } else {
                callback(false);
            }
        } catch (err) {
            console.log(err);
            callback(false);
        }
    };






    // DELETE CLUB API
    this.clubDelete = async (email, callback) => {
        try {
            const result = await db.collection('clubs').deleteOne({ email: email });
            if (result.deletedCount > 0) {
                callback(true); // Club deleted successfully
            } else {
                console.log('Club not found.');
                callback(false); // Club not found
            }
        } catch (err) {
            console.log(err);
            callback(false); // Error occurred
        }
    }





    
    // UPDATE CLUB_NAME API
    this.update_Club_name = async (clubs, Clubnewname, callback) => {
        try {
            const result = await db.collection('clubs').find({ email: clubs.email }).toArray();
            if (result.length > 0) {
                const club = result[0];
                const dbPassword = club.password;
                const match = await bcrypt.compare(clubs.password, dbPassword);
                if (!match) {
                    console.log("clubs credentials not matched");
                    callback([]);
                } else {
                    await db.collection('clubs').updateOne({ email: clubs.email }, { $set: { Club_name: Clubnewname } });
                    callback(result);
                }
            } else {
                console.log('clubs not found.');
                callback([]);
            }
        } catch (err) {
            console.log('Error:', err);
            callback([]);
        }
    }






    // // update_Owner_name api
    // this.update_Owner_name = (clubs, Owner_name, callback) => {
    //     db.collection('clubs').find({ email: clubs.email }).toArray()
    //         .then((result) => {
    //             if (result.length > 0) {
    //                 const club = result[0];
    //                 const dbPassword = club.password;
    //                 bcrypt.compare(clubs.password, dbPassword).then((match) => {
    //                     if (!match) {
    //                         console.log("clubs credentials not matched");
    //                         callback([]);
    //                     } else {
    //                         db.collection('clubs').updateOne({ email: clubs.email }, { $set: { Owner_name: Owner_name } })
    //                             .then(() => {
    //                                 callback(result);
    //                             })
    //                             .catch((updateErr) => {
    //                                 console.log('Error updating Owner name :', updateErr);
    //                             });
    //                     }
    //                 });
    //             } else {
    //                 console.log('clubs not found.');
    //                 callback([]);
    //             }
    //         })
    //         .catch((err) => {
    //             console.log('Error:', err);
    //             callback([]);
    //         });
    // }








    // //UPDATE Club PHONE API
    // this.login_with_otp = (clubs, callback) => {
    //     db.collection('users').find({ uuid: clubs.uuid, phone: clubs.phone }).toArray()
    //         .then((result) => {
    //             console.log(clubs.phone);
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
    //                     to: `+91${clubs.phone}`,
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

    //             } else {
    //                 console.log('club not found.');
    //                 callback([], null);
    //             }
    //         })
    //         .catch((err) => {
    //             console.log('Error:', err);
    //             callback([], null);
    //         });
    // };






    // //verify club owner phone
    // this.verifyClub_phone = (clubs, otp, callback) => {
    //     db.collection('clubs').find({ phone: clubs.phone }).toArray()
    //         .then((result) => {
    //             if (result.length > 0) {
    //                 if (otp == users.otp) {
    //                     callback(result);
    //                     db.collection("users").updateOne({ phone: clubs.phone }, { $set: { otp: '' } })
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
    // }








    // //UPDATE EMAIL API
    // this.updateClub_Email = (clubs, newemail, callback) => {
    //     db.collection('clubs').find({ email: clubs.email }).toArray()
    //         .then((result) => {
    //             if (result.length > 0) {
    //                 const club = result[0];
    //                 const dbPassword = club.password;
    //                 bcrypt.compare(clubs.password, dbPassword).then((match) => {
    //                     if (!match) {
    //                         console.log("user credentials not matched");
    //                         callback([]);
    //                     } else {
    //                         db.collection('clubs').updateOne({ email: clubs.email }, { $set: { email: newemail } })
    //                             .then(() => {
    //                                 callback(result);
    //                             })
    //                             .catch((updateErr) => {
    //                                 console.log('Error updating clubs email:', updateErr);
    //                             });
    //                     }
    //                 });
    //             } else {
    //                 console.log('clubs not found.');
    //                 callback([]);
    //             }
    //         })
    //         .catch((err) => {
    //             console.log('Error:', err);
    //             callback([]);
    //         });
    // }







    // //update Owner_DP in club model
    // this.updateOwner_DP = (clubs, newemail, callback) => {
    //     db.collection('clubs').find({ email: clubs.email }).toArray()
    //         .then((result) => {
    //             if (result.length > 0) {
    //                 const club = result[0];
    //                 const dbPassword = club.password;
    //                 bcrypt.compare(clubs.password, dbPassword).then((match) => {
    //                     if (!match) {
    //                         console.log("user credentials not matched");
    //                         callback([]);
    //                     } else {
    //                         db.collection('clubs').updateOne({ email: clubs.email }, { $set: { email: newemail } })
    //                             .then(() => {
    //                                 callback(result);
    //                             })
    //                             .catch((updateErr) => {
    //                                 console.log('Error updating clubs email:', updateErr);
    //                             });
    //                     }
    //                 });
    //             } else {
    //                 console.log('clubs not found.');
    //                 callback([]);
    //             }
    //         })
    //         .catch((err) => {
    //             console.log('Error:', err);
    //             callback([]);
    //         });
    // }
    // update_Owner_name api
    this.update_Owner_name = async (clubs, Owner_name, callback) => {
        try {
            const result = await db.collection('clubs').find({ email: clubs.email }).toArray();
            if (result.length > 0) {
                const club = result[0];
                const dbPassword = club.password;
                const match = await bcrypt.compare(clubs.password, dbPassword);
                if (!match) {
                    console.log("clubs credentials not matched");
                    callback([]);
                } else {
                    await db.collection('clubs').updateOne({ email: clubs.email }, { $set: { Owner_name: Owner_name } });
                    callback(result);
                }
            } else {
                console.log('clubs not found.');
                callback([]);
            }
        } catch (err) {
            console.log('Error:', err);
            callback([]);
        }
    }






    // login_with_otp api
    this.login_with_otp = async (clubs, callback) => {
        try {
            const result = await db.collection('users').find({ uuid: clubs.uuid, phone: clubs.phone }).toArray();
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
                    to: `+91${clubs.phone}`,
                    body: `your otp is ${new_otp}`
                }

                console.log("Before Twilio message sending");
                const twilioResult = await client.messages.create(msgOption);
                console.log("Twilio message sent successfully:", twilioResult);
                callback(true, new_otp);
                console.log("After Twilio message sending");

            } else {
                console.log('club not found.');
                callback([], null);
            }
        } catch (err) {
            console.log('Error:', err);
            callback([], null);
        }
    }







    // verifyClub_phone api
    this.verifyClub_phone = async (clubs, otp, callback) => {
        try {
            const result = await db.collection('clubs').find({ phone: clubs.phone }).toArray();
            if (result.length > 0) {
                if (otp == users.otp) {
                    callback(result);
                    await db.collection("users").updateOne({ phone: clubs.phone }, { $set: { otp: '' } });
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
    }








    // updateClub_Email api
    this.updateClub_Email = async (clubs, newemail, callback) => {
        try {
            const result = await db.collection('clubs').find({ email: clubs.email }).toArray();
            if (result.length > 0) {
                const club = result[0];
                const dbPassword = club.password;
                const match = await bcrypt.compare(clubs.password, dbPassword);
                if (!match) {
                    console.log("user credentials not matched");
                    callback([]);
                } else {
                    await db.collection('clubs').updateOne({ email: clubs.email }, { $set: { email: newemail } });
                    callback(result);
                }
            } else {
                console.log('clubs not found.');
                callback([]);
            }
        } catch (err) {
            console.log('Error:', err);
            callback([]);
        }
    }








    // updateOwner_DP api
    this.updateOwner_DP = async (clubs, newemail, callback) => {
        try {
            const result = await db.collection('clubs').find({ email: clubs.email }).toArray();
            if (result.length > 0) {
                const club = result[0];
                const dbPassword = club.password;
                const match = await bcrypt.compare(clubs.password, dbPassword);
                if (!match) {
                    console.log("user credentials not matched");
                    callback([]);
                } else {
                    await db.collection('clubs').updateOne({ email: clubs.email }, { $set: { email: newemail } });
                    callback(result);
                }
            } else {
                console.log('clubs not found.');
                callback([]);
            }
        } catch (err) {
            console.log('Error:', err);
            callback([]);
        }
    }




}

module.exports = new clubmodel();