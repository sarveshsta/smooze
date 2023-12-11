const { db, users, messages } = require('./connection');
const crypto = require('crypto');

function ChattingModel() {

    this.chatting = (messages,accessToken, callback) => {
        db.collection("messages").find().toArray()
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
                    messages._id = max_id + 1;
                } else {
                    messages._id = 1;
                }
                var flag = 1;
                let uuid = crypto.randomUUID();
                if (flag == 1) {
                    messages.uuid = uuid
                    messages.dt = new Date();
                    messages.token = accessToken
                    messages.otp = ''
                    db.collection("messages").insertOne(messages, (err) => {
                        if (err) {
                            console.log(err);
                            callback(false);
                        } else {
                            callback(true)
                            
                        }
                    })
                } else {
                    callback(false, { "msg": "" });
                }
            })
            .catch((err) => {
                console.log(err);
                callback(false);
            });
    }





    
    this.allSentMessages = (callback) => {
        db.collection("users").aggregate([
            {
                $lookup: {
                    from: "messages",
                    localField: "email",
                    foreignField: "userEmail",
                    as: "Details",
                },
            },
        ]).toArray()
            .then((result) => {
                callback(result);
            })
            .catch((err) => {
                console.log(err);
            });
    }


}

module.exports = new ChattingModel();

