var express = require('express');
var router = express.Router();
var indexmodel = require('../../models/UserApi');

//DELETE USER PROFILE ROUTE
router.delete('/', (req, res) => {
    const  email = req.body.email
    indexmodel.DeleteProfile(req.body,email, (result) => {
        if (result) {
            console.log('Profile deleted successfully.');
            res.status(200).send('Profile deleted successfully.');
        } else {
            console.log('Failed to delete Profile.');
            res.status(500).render('error');
        }
    });
});

module.exports = router;