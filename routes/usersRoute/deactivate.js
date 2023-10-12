var express = require('express');
var router = express.Router();
var indexmodel = require('../../models/allApis');

//DEACTIVATE USER ROUTE

router.post('/', (req, res, next) => {
  indexmodel.deactivateUser(req.body, (result) => {
    if (result) {
      console.log('User deactivated successfully.');
    } else {
      console.log('Failed to deactivate user.');
    }
  })
});

module.exports = router;