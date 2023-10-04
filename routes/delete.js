var express = require('express');
var router = express.Router();
var indexmodel = require('../models/indexmodel');

//DELETE USER ROUTE

router.delete('/', (req, res) => {
  indexmodel.deleteuser(req.body, (result) => {
    if (result){
      console.log('User deleted successfully.');
      res.status(200).send('User deleted successfully.');
    } else {
      console.log('Failed to delete user.');
      res.status(500).render('error');
    }
  });
});

module.exports = router;