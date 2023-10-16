const express = require('express');
const router = express.Router();
const indexmodel = require('../../models/allApis');
const createTokens = require('../../utils/JWT');
const upload = require('../../utils/imageUpload');


//REGISTER ROUTE

router.post('/', upload.single('image'), function (req, res, next) {
    
    const accessToken = createTokens("clubs");
    res.cookie("access-Token", accessToken, {
        maxAge: 60 * 60 * 24 * 30 * 1000,
    });
    
    indexmodel.registerClub(req.body, accessToken, req.file, (result) => {
        console.log("Result:", result);
        if (result) {
            console.log("Club registered successfully");
        } else {
            console.log("Club already exists or invalid data");
        }
    });
});

module.exports = router;
