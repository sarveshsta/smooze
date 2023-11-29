// const OneSignal = require('onesignal-node');

// const appId = '9a9b763d-d0ca-44c9-ac39-011569b6c8a6';
// const apiKey = 'OGM4ZDI4ZDQtYzA1Ny00MDA3LTg1MDYtYTllYmYwMzU2YzY0';

// const oneSignalClient = new OneSignal.Client({ appId, apiKey });

// // Function to send a push notification
// const notifiy = async function sendPushNotification(userId, message) {
//     const playerIds = await getPlayerIdsForUser(userId);

//     const notification = new OneSignal.Notification({
//         contents: {
//             en: message,
//         },
//         include_player_ids: playerIds,
//     });

//     try {
//         const response = await oneSignalClient.sendNotification(notification);
//         console.log('Push notification sent:', response.body);
//     } catch (error) {
//         console.error('Error sending push notification:', error);
//     }
// }


// module.exports = notifiy