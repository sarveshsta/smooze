var express = require('express');
var router = express.Router();
var indexmodel = require('../../models/UserApi');

//DELETE USER ROUTE
router.delete('/', (req, res) => {
  indexmodel.RetreveDisLike(req.body, (result) => {
    if (result){
      console.log('User DisLike Retreved successfully.');
      res.status(200).send('User DisLike Retreved successfully.');
    } else {
      console.log('Failed to Retreved DisLike .');
      res.status(500).render('error');
    }
  });
});

module.exports = router;