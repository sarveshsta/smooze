var express = require('express');
var router = express.Router();
var indexmodel = require('../../models/UserApi');

//update name ROUTE
router.post('/', function (req, res, next) {
    const name = req.body.name

    indexmodel.updateName(req.body,name,(result) => {
        if (result) {
            console.log('Name updated successfully');
            res.send('Name updated successfully');
        } else {
            console.log('Error while updating Name');
        }
    });
});

module.exports = router;