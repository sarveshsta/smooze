var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressWinston = require('express-winston');
require('winston-mongodb');
const loggerr = require('./logger');
const { transports, format } = require('winston');

//ALL THE ROUTES ARE HERE
const registerRouter = require('./routes/usersRoute/register');
const loginRouter = require('./routes/usersRoute/login');
const logoutRouter = require('./routes/usersRoute/logout');
const deactivateRouter = require('./routes/usersRoute/deactivate');
const deleteuser = require('./routes/usersRoute/delete');
const onboarding = require('./routes/onBoardRoute/onboarding');
const forgotPassword = require('./routes/usersRoute/forgotPassword');
const resetPassword = require('./routes/usersRoute/resetPassword');
const loginOTP = require('./routes/usersRoute/loginOTP');
const verifyotp = require('./routes/usersRoute/verifyotp');
const clubRegister = require('./routes/ClubsRoutes/clubRegister');
const clubDelete = require('./routes/clubsRoutes/clubDelete');
const updateName = require('./routes/usersRoute/updateName');
const updatePhone = require('./routes/usersRoute/updatePhone');
const updateEmail = require('./routes/usersRoute/updateEmail');
const updateClub_name = require('./routes/clubsRoutes/updateClub_name');
const updateClub_Phone = require('./routes/clubsRoutes/updateClub_Phone');
const verifyClub_phone = require('./routes/clubsRoutes/verifyClub_phone');
const updateClub_Email = require('./routes/clubsRoutes/updateClub_Email');
const update_Owner_name = require('./routes/clubsRoutes/update_Owner_name');
const getUserDetails = require('./routes/onBoardRoute/getUserDetail');
const clubMenu = require('./routes/menuRoute/clubMenu');
const getClubMenuDetails = require('./routes/menuRoute/getClubMenuDetails');
const updatePrice = require('./routes/menuRoute/updatePrice');
const updateonboarding = require('./routes/onBoardRoute/updateonboarding');
const getUserPhotos = require('./routes/usersRoute/getUserPhotos');
const getUserDetailsWithPhotos = require('./routes/usersRoute/getUserDetailsWithPhotos');
const addEvent = require('./routes/EventRoutes/addEvent');
const deleteEvent = require('./routes/EventRoutes/deleteEvent');
const updateEventDate = require('./routes/EventRoutes/updateEventDate');
const updateEventTime = require('./routes/EventRoutes/updateEventTime');
const getClubEvents = require('./routes/EventRoutes/getClubEvents');
const updateEventDescription = require('./routes/EventRoutes/updateEventDescription');
const UserProfile = require('./routes/usersRoute/UserProfile');
const EditProfileBio = require('./routes/usersRoute/EditProfileBio');
const EditProfileIntrest = require('./routes/usersRoute/EditProfileIntrest');
const EditProfileLanguage = require('./routes/usersRoute/EditProfileLanguage');
const EditProfileHeight = require('./routes/usersRoute/EditProfileHeight');
const EditProfileWork = require('./routes/usersRoute/EditProfileWork');
const updateLocation = require('./routes/usersRoute/updateLocation');
const userPreferences = require('./routes/usersRoute/userPreferences');
const update_Min_Max_Age = require('./routes/usersRoute/update_Min_Max_Age');
const updateDistanceRadius = require('./routes/usersRoute/updateDistanceRadius');
const DeleteProfile = require('./routes/usersRoute/DeleteProfile');
const EditProfileStarSign = require('./routes/usersRoute/EditProfileStarSign');
const UserCompatibility = require('./routes/UserCompatibility/UserCompatibility');
const clubvisited = require('./routes/ClubVisited/clubvisited');
const OfferSmooz = require('./routes/OfferSmooz/OfferSmooz');
const OfferedSmooz = require('./routes/OfferSmooz/OfferedSmooz');
const SmoozBill = require('./routes/OfferSmooz/SmoozBill');
const itemOfferedMe = require('./routes/OfferSmooz/itemOfferedMe');
const UserLikeSomeOne = require('./routes/usersRoute/UserLikeSomeOne');
const UserDisLikeSomeOne = require('./routes/usersRoute/UserDisLikeSomeOne');
const UserSuperLikeSomeOne = require('./routes/usersRoute/UserSuperLikeSomeOne');
const RetreveLike = require('./routes/usersRoute/RetreveLike');
const RetreveDisLike = require('./routes/usersRoute/RetreveDisLike');
const getLikedUser = require('./routes/usersRoute/getLikedUser');
const CommentUser = require('./routes/usersRoute/CommentUser');
const getLikeCount = require('./routes/usersRoute/getLikeCount');
const getDisLikeCount = require('./routes/usersRoute/getDisLikeCount');
const getSuperLikeCount = require('./routes/usersRoute/getSuperLikeCount');
const getCommentCount = require('./routes/usersRoute/getCommentCount');
const chatting = require('./routes/ChattingRoute/chatting');
const allSentMessages = require('./routes/ChattingRoute/allSentMessages');
const order = require('./routes/CreateOrder/order');
const sendNotification = require('./routes/CreateNotification/sendNotification');
const getUserProfileQuestions = require('./routes/usersRoute/getUserProfileQuestions');
const inAppMessaging = require('./routes/CreateNotification/inAppMessaging');

var app = express();

app.use(expressWinston.logger({
  winstonInstance: loggerr,
  statusLevels: true
})) 

//error format
const myFormat = format.printf(({ level, meta, timestamp }) => {
  return `${timestamp}  ${level} : ${meta.message}`
})

//error logger
app.use(expressWinston.errorLogger({
  transports: [
    new transports.File({
      filename: 'logsInternalErrors'
    })
  ],
  format: format.combine(
    format.json(),
    format.timestamp(),
    myFormat
  )
}))


// var admin = require("firebase-admin");

// var serviceAccount = require("path/to/serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });


// // view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//ALL MIDDLEWARES ARE USED HERE
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/deactivate', deactivateRouter);
app.use('/delete', deleteuser);
app.use('/onboarding', onboarding);
app.use('/forgotPassword', forgotPassword);
app.use('/resetPassword', resetPassword);
app.use('/loginOTP', loginOTP);
app.use('/verifyOTP', verifyotp);
app.use('/verifyClub_phone', verifyClub_phone);
app.use('/clubRegister', clubRegister);
app.use('/clubDelete', clubDelete);
app.use('/updateClub_name', updateClub_name);
app.use('/updateClub_Phone', updateClub_Phone);
app.use('/updateClub_Email', updateClub_Email);
app.use('/update_Owner_name', update_Owner_name);
app.use('/updateName', updateName);
app.use('/updatePhone', updatePhone);
app.use('/updateEmail', updateEmail);
app.use('/getUserDetails', getUserDetails);
app.use('/clubMenu', clubMenu);
app.use('/getClubMenuDetails', getClubMenuDetails);
app.use('/updatePrice', updatePrice);
app.use('/updateonboarding', updateonboarding);
app.use('/getUserPhotos', getUserPhotos);
app.use('/getUserDetailsWithPhotos', getUserDetailsWithPhotos);
app.use('/addEvent', addEvent);
app.use('/deleteEvent', deleteEvent);
app.use('/updateEventDate', updateEventDate);
app.use('/updateEventTime', updateEventTime);
app.use('/getClubEvents', getClubEvents);
app.use('/updateEventDescription', updateEventDescription);
app.use('/UserProfile', UserProfile);
app.use('/getUserProfileQuestions', getUserProfileQuestions);
app.use('/EditProfileBio', EditProfileBio);
app.use('/EditProfileIntrest', EditProfileIntrest);
app.use('/EditProfileLanguage', EditProfileLanguage);
app.use('/EditProfileHeight', EditProfileHeight);
app.use('/EditProfileWork', EditProfileWork);
app.use('/updateLocation', updateLocation);
app.use('/userPreferences', userPreferences);
app.use('/update_Min_Max_Age', update_Min_Max_Age);
app.use('/updateDistanceRadius', updateDistanceRadius);
app.use('/DeleteProfile', DeleteProfile);
app.use('/EditProfileStarSign', EditProfileStarSign);
app.use('/UserCompatibility', UserCompatibility);
app.use('/clubvisited', clubvisited);
app.use('/OfferSmooz', OfferSmooz);
app.use('/OfferedSmooz', OfferedSmooz);
app.use('/SmoozBill', SmoozBill);
app.use('/itemOfferedMe', itemOfferedMe);
app.use('/UserLikeSomeOne', UserLikeSomeOne);
app.use('/RetreveLike', RetreveLike);
app.use('/UserDisLikeSomeOne', UserDisLikeSomeOne);
app.use('/RetreveDisLike', RetreveDisLike);
app.use('/UserSuperLikeSomeOne', UserSuperLikeSomeOne);
app.use('/getLikedUser', getLikedUser);
app.use('/CommentUser', CommentUser);
app.use('/getLikeCount', getLikeCount);
app.use('/getDisLikeCount', getDisLikeCount);
app.use('/getSuperLikeCount', getSuperLikeCount);
app.use('/getCommentCount', getCommentCount);
app.use('/chatting', chatting);
app.use('/allSentMessages', allSentMessages);
app.use('/order',order);
app.use('/sendNotification',sendNotification);
app.use('/inAppMessage', inAppMessaging);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;



// const OneSignal = require('onesignal-node');

// const appId = 'your_one_signal_app_id';
// const apiKey = 'your_one_signal_api_key';

// const oneSignalClient = new OneSignal.Client({ appId, apiKey });

// // Function to send a push notification
// async function sendPushNotification(userId, message) {
//   const playerIds = await getPlayerIdsForUser(userId);

//   const notification = new OneSignal.Notification({
//     contents: {
//       en: message,
//     },
//     include_player_ids: playerIds,
//   });

//   try {
//     const response = await oneSignalClient.sendNotification(notification);
//     console.log('Push notification sent:', response.body);
//   } catch (error) {
//     console.error('Error sending push notification:', error);
//   }
// }
