// const { db, users, messages } = require('./connection');
// const crypto = require('crypto');

// function ChattingModel() {

//     this.chatting = (messages,accessToken, callback) => {
//         db.collection("messages").find().toArray()
//             .then((val) => {
//                 console.log(val);
//                 var result = val;
//                 if (result.length > 0) {
//                     var max_id = result[0]._id;
//                     for (let row of result) {
//                         if (max_id < row._id) {
//                             max_id = row._id;
//                         }
//                     }
//                     messages._id = max_id + 1;
//                 } else {
//                     messages._id = 1;
//                 }
//                 var flag = 1;
//                 let uuid = crypto.randomUUID();
//                 if (flag == 1) {
//                     messages.uuid = uuid
//                     messages.dt = new Date();
//                     messages.token = accessToken
//                     messages.otp = ''
//                     db.collection("messages").insertOne(messages, (err) => {
//                         if (err) {
//                             console.log(err);
//                             callback(false);
//                         } else {
//                             callback(true)
                            
//                         }
//                     })
//                 } else {
//                     callback(false, { "msg": "" });
//                 }
//             })
//             .catch((err) => {
//                 console.log(err);
//                 callback(false);
//             });
//     }





    
//     this.allSentMessages = (callback) => {
//         db.collection("users").aggregate([
//             {
//                 $lookup: {
//                     from: "messages",
//                     localField: "email",
//                     foreignField: "userEmail",
//                     as: "Details",
//                 },
//             },
//         ]).toArray()
//             .then((result) => {
//                 callback(result);
//             })
//             .catch((err) => {
//                 console.log(err);
//             });
//     }


// }

// module.exports = new ChattingModel();

const { db, users, messages } = require('./connection');
const crypto = require('crypto');

function ChattingModel() {

    this.chatting = async (messages, accessToken, callback) => {
        try {
            const val = await db.collection("messages").find().toArray();
            console.log(val);
            let result = val;
            if (result.length > 0) {
                let max_id = result[0]._id;
                for (let row of result) {
                    if (max_id < row._id) {
                        max_id = row._id;
                    }
                }
                messages._id = max_id + 1;
            } else {
                messages._id = 1;
            }
            let flag = 1;
            let uuid = crypto.randomUUID();
            if (flag == 1) {
                messages.uuid = uuid
                messages.dt = new Date();
                messages.token = accessToken
                messages.otp = ''
                await db.collection("messages").insertOne(messages);
                callback(true);
            } else {
                callback(false, { "msg": "" });
            }
        } catch (err) {
            console.log(err);
            callback(false);
        }
    }





    this.allSentMessages = async (callback) => {
        try {
            const result = await db.collection("users").aggregate([
                {
                    $lookup: {
                        from: "messages",
                        localField: "email",
                        foreignField: "userEmail",
                        as: "Details",
                    },
                },
            ]).toArray();
            callback(result);
        } catch (err) {
            console.log(err);
        }
    }



    
}

module.exports = new ChattingModel();
