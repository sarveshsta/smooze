var express = require('express');
var router = express.Router();
var indexmodel = require('../../models/allApis');

//DELETE USER ROUTE

router.delete('/', (req, res) => {
  indexmodel.deleteClub(req.body, (result) => {
    if (result){
      console.log('Club deleted successfully.');
      res.status(200).send('Club deleted successfully.');
    } else {
      console.log('Failed to delete Club.');
      res.status(500).render('error');
    }
  });
});

module.exports = router;