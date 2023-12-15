var express = require('express');
var router = express.Router();
var CompatibleModle = require('../../models/compatibility');
var calculateCompatibilityForAllUsers = require('../../utils/compatible');

//GET USER COMPATIBILITY ROUTE
router.get('/', (req, res) => {
    CompatibleModle.UserCompatibility((data) => {
        if (data) {
            res.send({ data: data });
            const compatibilityMatrix = calculateCompatibilityForAllUsers(data);

            // Display compatibility matrix
            compatibilityMatrix.forEach((entry) => {
                console.log(`${entry.user1} and ${entry.user2}: ${entry.compatibilityPercentage}%`);
            });

        } else {
            res.status(500).render('error');
        }
    });
});

module.exports = router;