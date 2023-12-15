const express = require('express');
const router = express.Router();
const validateFiles = require('../../utils/validateFiles'); 
const clubmodel = require('../../models/clubAPI');
const createTokens3 = require('../../utils/JWT');
const upload = require('../../utils/clubImageUpload');


//REGISTER club ROUTE
router.post('/', upload,validateFiles,function (req, res, next) {
    const accessToken = createTokens3("clubs");
    res.cookie("access-Token", accessToken, {
        maxAge: 60 * 60 * 24 * 30 * 1000,
    });
    const Password = req.body.password;
    const Club_Banner = req.files.Club_Banner[0].filename;
    const Owner_DP = req.files.Owner_DP[0].filename;
    const Club_Docs = req.files.Club_Docs[0].filename;
    const Owner_Aadhar = req.files.Owner_Aadhar[0].filename;
    clubmodel.registerClub(req.body, Club_Banner,Owner_Aadhar,Club_Docs,Owner_DP,accessToken, Password , (result) => {
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