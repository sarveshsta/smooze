var express = require('express');
var router = express.Router();
var indexmodel = require('../models/indexmodel');

router.post('/', (req, res, next) => {
  indexmodel.deleteuser(req.body, (result) => {
    if (result) {
      console.log('User deleted successfully.');
    } else {
      console.log('Failed to delete user.');
    }
  })
});

module.exports = router;