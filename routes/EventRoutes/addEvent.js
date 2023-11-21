const express = require('express');
const router = express.Router();
const eventmodel = require('../../models/EventApi');
const createTokens = require('../../utils/JWT');
const upload2 = require('../../utils/EventPhotosUpload');
const validateFiles = require('../../utils/validateFiles');

//AddEvent ROUTE
router.post('/', upload2, validateFiles, function (req, res, next) {
    const accessToken = createTokens("clubs");
    res.cookie("access-Token", accessToken, {
        maxAge: 60 * 60 * 24 * 30 * 1000,
    });
    const addphotos = req.files.addphotos[0].filename
    const addphotos1 = req.files.addphotos1[0].filename
    const addphotos2 = req.files.addphotos2[0].filename
    
    eventmodel.addEvent(req.body, addphotos, addphotos1, addphotos2, accessToken, (result) => {
        console.log("Result:", result);
        if (result) {
            res.send("Event added successfully");
            console.log("Event added successfully");
        } else {
            res.send("Event already exists or invalid data");
            console.log("Event already exists or invalid data");
        }
    });
});

module.exports = router;