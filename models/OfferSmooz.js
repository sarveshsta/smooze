const { db, clubs , users} = require('./connection');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const fast2sms = require('fast-two-sms');
const createTokens = require('../utils/JWT');
const { EMAIL, PASS, authOTPKEY } = require('../constants/constants');
const otpGenerator = require('otp-generator');


function OfferModel() {


    //Offer Smooz
    this.OfferSmooz = (users,callback) => {
        db.collection("users").find({email : users.email}).toArray()
        .then((result)=>{
            if (result.length > 0) {
                const user = result[0];
                const dbPassword = user.password;
                bcrypt.compare(users.password, dbPassword).then((match) => {
                    if (!match) {
                        console.log("user credentials not matched");
                        callback([]);
                    } else {
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
                    }
                })
            }
        })





        
    };


}

module.exports = new OfferModel();