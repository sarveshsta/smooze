var express = require('express');
var router = express.Router();
var indexmodel = require('../models/indexmodel');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

//regsitration
router.post('/register', function (req, res, next) {
  // console.log(req.body)
  indexmodel.registeruser(req.body, (result) => {
    console.log("Result :", result);
    if (result) {
      console.log("user registered successfully");
      // res.render('register', { "msg": 'User Register Successfully...' });
    } else {
      console.log("user already exist");
      // res.render('register', { "msg": 'User already exists Please Register again...' });
    }
  })
});


//login
router.post('/login', (req, res, next) => {
  indexmodel.userlogin(req.body, (results) => {
    console.log(results);
    if (results.length > 0) {
      if (results[0].role == "user") {
        
        const date = new Date();
        date.setHours(date.getHours() + 5);
        
        res.cookie('isLoggedin', true, {
          secure: true,
          httpOnly: true,
          expires: date,
          sameSite: 'strict',
        });

        res.setHeader('Set-Cookie', [
          'isLoggedin= true; HttpOnly; Secure',
          `Expires=${date}; HttpOnly; Secure`,
          `user_id=${results[0]._id};HttpOnly; Secure`,
        ]);

        console.log("login as user");
        res.send('Your are logged in');
        // res.redirect('/users');

      } else {
        //  res.send("login as an admin")
        console.log("login as an admin");
        // res.redirect('/admin');
      }
    } else {
      res.render('login', { 'msg': 'Invalid user or verify your account' })
    }
  });
});


//logout
router.get('/logout', (req, res, next) => {
  res.setHeader('Set-Cookie', [
    'isLoggedin = false; HttpOnly; Secure',
    'Expires = Expired; HttpOnly; Secure'
  ]);
  console.log('You are logged out');
});



module.exports = router;
