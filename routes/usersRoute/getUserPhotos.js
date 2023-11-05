var express = require('express');
var router = express.Router();
var indexmodel = require('../../models/allApis');
const createTokens = require('../../utils/JWT');
const upload1 = require('../../utils/imageUpload');

//REGISTER ROUTE

router.post('/', upload1,function (req, res, next) {
    // console.log(req.body)
    const accessToken = createTokens("users");
    res.cookie("access-Token", accessToken, {
        maxAge: 60 * 60 * 24 * 30 * 1000,
    });

    const image1 = req.files.image1[0].filename
    const image2 = req.files.image2[0].filename
    const image3 = req.files.image3[0].filename
    const image4 = req.files.image4[0].filename
    

    indexmodel.getUserPhotos(req.body,image1,image2,image3,image4,accessToken,(result) => {
        console.log("Result :", result);
        if (result) {
            console.log("user added photos");
        }
        else {
            console.log("user unable to add photos")
        }
    })
});

module.exports = router;