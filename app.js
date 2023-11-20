var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


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
const UserProfile  = require('./routes/usersRoute/UserProfile');
const EditProfileBio  = require('./routes/usersRoute/EditProfileBio');
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




var app = express();

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
app.use('verifyClub_phone', verifyClub_phone);
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
app.use('/updateEventDescription',updateEventDescription);
app.use('/UserProfile',UserProfile);
app.use('/EditProfileBio',EditProfileBio);
app.use('/EditProfileIntrest',EditProfileIntrest);
app.use('/EditProfileLanguage',EditProfileLanguage);
app.use('/EditProfileHeight',EditProfileHeight);
app.use('/EditProfileWork',EditProfileWork);
app.use('/updateLocation',updateLocation);
app.use('/userPreferences',userPreferences);
app.use('/update_Min_Max_Age',update_Min_Max_Age);
app.use('/updateDistanceRadius',updateDistanceRadius);
app.use('/DeleteProfile',DeleteProfile);
app.use('/EditProfileStarSign',EditProfileStarSign);
app.use('/UserCompatibility',UserCompatibility);
app.use('/clubvisited',clubvisited);
app.use('/OfferSmooz',OfferSmooz);

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