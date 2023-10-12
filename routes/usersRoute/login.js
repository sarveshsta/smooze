var express = require('express');
var router = express.Router();
var indexmodel = require('../../models/allApis');
const createTokens = require('../../utils/JWT');

//LOGIN ROUTE

router.post('/', (req, res, next) => {
    indexmodel.userlogin(req.body, (results) => {
        console.log(results);
        if (results.length > 0) {
            if (results[0].role == "user") {

                // const date = new Date();
                // date.setHours(date.getHours() + 5);

                // res.cookie('isLoggedin', true, {
                //     secure: true,
                //     httpOnly: true,
                //     expires: date,
                //     sameSite: 'strict',
                // });

                //CREATION OF TOKEN
                const accessToken = createTokens("user");
                res.cookie("access-Token", accessToken, {
                    maxAge : 60*60*24*30*1000,
                });
                
                //SETTING COOKIES WHILE LOGIN
                // res.setHeader('Set-Cookie', [
                //     'access-Token=${accessToken};',
                //     'isLoggedin= true; HttpOnly; Secure',
                //     `Expires=${date}; HttpOnly; Secure`,
                //     `user_id=${results[0]._id};HttpOnly; Secure`,
                // ]);


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

module.exports = router;