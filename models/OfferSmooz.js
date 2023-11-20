const { db, clubs, users, offersmoozs } = require('./connection');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const fast2sms = require('fast-two-sms');
const createTokens = require('../utils/JWT');
const { EMAIL, PASS, authOTPKEY } = require('../constants/constants');
const otpGenerator = require('otp-generator');


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


    this.OfferedSmooz = (offersmoozs , callback ) => {
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
                offersmoozs.uuid = uuid
                offersmoozs.dt = Date();
                db.collection("offersmoozs").insertOne(offersmoozs, (err, result) => {
                    if (err) {
                        console.log(err);
                        callback(false);
                    } else {
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


}

module.exports = new OfferModel();