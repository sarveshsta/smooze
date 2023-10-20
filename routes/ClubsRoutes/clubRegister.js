const express = require('express');
const router = express.Router();
const clubmodel = require('../../models/clubAPI');
const createTokens = require('../../utils/JWT');
const upload = require('../../utils/imageUpload');


//REGISTER ROUTE
router.post('/', upload.single('image'), function (req, res, next) {
    const accessToken = createTokens("clubs");
    res.cookie("access-Token", accessToken, {
        maxAge: 60 * 60 * 24 * 30 * 1000,
    });
    const Password = req.body.password
    clubmodel.registerClub(req.body, accessToken, Password , (result) => {
        console.log("Result:", result);
        if (result) {
            res.send("Club registered successfully");
            console.log("Club registered successfully");
        } else {
            res.send("Club already exists or invalid data");
            console.log("Club already exists or invalid data");
        }
    });
});

module.exports = router;
