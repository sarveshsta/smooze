var express = require('express');
var router = express.Router();
var indexmodel = require('../../models/UserApi');

//DELETE USER ROUTE
router.delete('/', (req, res) => {
  indexmodel.RetreveLike(req.body, (result) => {
    if (result){
      console.log('User Like Retreved successfully.');
      res.status(200).send('User Like Retreved successfully.');
    } else {
      console.log('Failed to Retreved Like .');
      res.status(500).render('error');
    }
  });
});

module.exports = router;