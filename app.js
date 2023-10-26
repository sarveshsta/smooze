var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


//ALL THE ROUTES ARE HERE
var registerRouter = require('./routes/usersRoute/register');
var loginRouter = require('./routes/usersRoute/login');
var logoutRouter = require('./routes/usersRoute/logout');
var deactivateRouter = require('./routes/usersRoute/deactivate');
var deleteuser = require('./routes/usersRoute/delete');
var onboarding = require('./routes/onBoardRoute/onboarding');
var forgotPassword = require('./routes/usersRoute/forgotPassword');
const resetPassword = require('./routes/usersRoute/resetPassword');
const loginOTP = require('./routes/usersRoute/loginOTP');
const verifyotp = require('./routes/usersRoute/verifyotp');
const clubRegister = require('./routes/ClubsRoutes/clubRegister');
const clubDelete = require('./routes/ClubsRoutes/clubDelete');
const updateName = require('./routes/usersRoute/updateName');
const updatePhone = require('./routes/usersRoute/updatePhone');
const updateEmail = require('./routes/usersRoute/updateEmail');
const updateClub_name = require('./routes/ClubsRoutes/updateClub_name');
const updateClub_Phone = require('./routes/ClubsRoutes/updateClub_Phone');
const verifyClub_phone = require('./routes/ClubsRoutes/verifyClub_phone');
const updateClub_Email = require('./routes/ClubsRoutes/updateClub_Email');
const update_Owner_name = require('./routes/ClubsRoutes/update_Owner_name');
const getUserDetails = require('./routes/onBoardRoute/getUserDetail');
const clubMenu = require('./routes/menuRoute/clubMenu');
const getClubMenuDetails = require('./routes/menuRoute/getClubMenuDetails');



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
