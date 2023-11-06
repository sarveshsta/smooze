const { db, clubs, events } = require('./connection');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const fast2sms = require('fast-two-sms');
const createTokens = require('../utils/JWT');
const { EMAIL, PASS, authOTPKEY } = require('../constants/constants');
const otpGenerator = require('otp-generator');


function eventmodel() {

    this.addEvent = (events,addphotos, callback) => {
        db.collection("events").find().toArray()
            .then((val) => {
                console.log(val);
                var result = val;
                let max_id = 0;
                if (result.length > 0) {
                    max_id = Math.max(...result.map((row) => row._id));
                }
                events._id = max_id + 1;

                let flag = 1;
                if (result.length > 0) {
                    for (let row of result) {
                        if (events.email == row.email) {
                            flag = 0;
                            break;
                        }
                    }
                }

                if (flag == 1) {
                    events.addphotos = addphotos
                    events.date = new Date();
                    events.time = new Date().getTime();
                    events.token = accessToken;
                    db.collection("events").insertOne(events, (err) => {
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

}

module.exports = new eventmodel();