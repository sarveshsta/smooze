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
var onboarding = require('./routes/usersRoute/onboarding');
var forgotPassword = require('./routes/usersRoute/forgotPassword');
const resetPassword  = require('./routes/usersRoute/resetPassword');
const loginOTP = require('./routes/usersRoute/loginOTP');
const verifyotp = require('./routes/usersRoute/verifyotp');
const clubRegister = require('./routes/ClubsRoutes/clubRegister');
const clubDelete = require('./routes/ClubsRoutes/clubDelete');
const updateName = require('./routes/usersRoute/updateName');
const updatePhone = require('./routes/usersRoute/updatePhone');
const updateEmail = require('./routes/usersRoute/updateEmail');
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
app.use('/loginOTP',loginOTP);
app.use('/verifyOTP',verifyotp);
app.use('/clubRegister',clubRegister);
app.use('/clubDelete',clubDelete);
app.use('/updateName',updateName);
app.use('/updatePhone',updatePhone);
app.use('/updateEmail',updateEmail);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
