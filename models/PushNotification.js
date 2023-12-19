// const { db, users } = require('./connection');
// const OneSignal = require('onesignal-node');

// function Notifymodel() {



//     this.sendNotification = (uuid, message, callback) => {
//         const oneSignalClient = new OneSignal.Client({
//             userAuthKey: '*********************************************MjA4',
//             app: {
//                 appAuthKey: 'NWYyODhhNjYtZDQ3OC00YjZkLWE0NTItZGQzMDFhMmI3NWUw',
//                 appId: '9a9b763d-d0ca-44c9-ac39-011569b6c8a6',
//             },
//         });

//         const notification = {
//             contents: {
//                 en: message,
//             },
//             include_player_ids: [uuid],
//         };

//         db.collection("users")
//             .findOne({ uuid: uuid })
//             .then((user) => {
//                 console.log(user);
//                 if (user) {
//                     return oneSignalClient.createNotification(notification);
//                 } else {
//                     throw new Error('User not found or missing OneSignal player ID');
//                 }
//             })
//             .then((response) => {
//                 console.log('Notification sent:', response.body.id);
//                 callback(true);
//             })
//             .catch((err) => {
//                 console.error('Error sending notification:', err);
//                 callback(false);
//             });
//     };


// }

// module.exports = new Notifymodel();

const { db, users } = require('./connection');
const OneSignal = require('onesignal-node');

function Notifymodel() {
    this.sendNotification = async (uuid, message, callback) => {
        try {
            const oneSignalClient = new OneSignal.Client({
                userAuthKey: '*********************************************MjA4',
                app: {
                    appAuthKey: 'NWYyODhhNjYtZDQ3OC00YjZkLWE0NTItZGQzMDFhMmI3NWUw',
                    appId: '9a9b763d-d0ca-44c9-ac39-011569b6c8a6',
                },
            });

            const notification = {
                contents: {
                    en: message,
                },
                include_player_ids: [uuid],
            };

            const user = await db.collection("users").findOne({ uuid: uuid });

            if (user) {
                const response = await oneSignalClient.createNotification(notification);
                console.log('Notification sent:', response.body.id);
                callback(true);
            } else {
                throw new Error('User not found or missing OneSignal player ID');
            }
        } catch (err) {
            console.error('Error sending notification:', err);
            callback(false);
        }
    };
}

module.exports = new Notifymodel();
