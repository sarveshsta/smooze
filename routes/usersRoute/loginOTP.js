var express = require('express');
var router = express.Router();
var indexmodel = require('../../models/UserApi');
const createTokens = require('../../utils/JWT');


// LOGIN With OTP ROUTE
router.post('/', (req, res, next) => {
    indexmodel.login_with_otp(req.body, (success, otp) => {
        console.log(success);
        if (success) {
            // CREATION OF TOKEN
            const accessToken = createTokens("user");
            res.cookie("access-Token", accessToken, {
                maxAge: 60 * 60 * 24 * 30 * 1000,
            });

            // Send a success response along with the OTP
            res.json({
                success: true,
                OTP: otp,
                role: req.body.role // Assuming you have a role in the request body
            });
        } else {
            // Send an error response
            res.status(400).json({
                success: false,
                message: 'Invalid user or phone number'
            });
        }
    });
});

module.exports = router;