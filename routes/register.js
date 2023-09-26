var express = require('express');
var router = express.Router();
var indexmodel = require('../models/indexmodel');

//regsitration route
router.post('/', function (req, res, next) {
    // console.log(req.body)
    indexmodel.registeruser(req.body, (result) => {
        console.log("Result :", result);
        if (result) {
            console.log("user registered successfully");
        } else {
            // if ('msg') {
            //   console.log({ "msg": "invalid phone number" });
            // }
            // else {
            //   if ('msg-gen') {
            //     console.log('invalid gender');
            //   }
            //   else {
            //     if ('msgState') {
            //       console.log('Invalid state.');
            //     }
            //     else {
            //       if ('msgCity') {
            //         console.log('Invalid city for the selected state.')
            //       } else {
            console.log("user already exist");
            // }

            // }
            // }


            // res.render('register', { "msg": 'User already exists Please Register again...' });
        }
    })
});

module.exports = router;