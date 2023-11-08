var express = require('express');
var router = express.Router();
var indexmodel = require('../../models/allApis');
const createTokens = require('../../utils/JWT');

//LOGIN With OTP ROUTE
router.post('/', (req, res, next) => {
    indexmodel.login_with_otp(req.body, (results, OTP) => {
        console.log(results);
        if (results.length > 0 && OTP) {
            if (results[0].role == "user") {

                //CREATION OF TOKEN
                const accessToken = createTokens("user");
                res.cookie("access-Token", accessToken, {
                    maxAge: 60 * 60 * 24 * 30 * 1000,
                });

                // Send a success response along with the OTP
                res.json({
                    success: true,
                    OTP: OTP,
                    role : results[0].role
                });

            } else {
                console.log("login as an admin");
            }

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