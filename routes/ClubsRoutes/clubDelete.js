var express = require('express');
var router = express.Router();
var clubmodel = require('../../models/clubAPI');

//DELETE USER ROUTE

router.delete('/', (req, res) => {
  const _id = req.body._id;
  const email = req.body.email;
  clubmodel.clubDelete(_id, email, (result) => {
    if (result) {
      console.log('Club deleted successfully.');
      res.status(200).send('Club deleted successfully.');
    } else {
      console.log('Failed to delete Club.');
      res.status(404).send('Club not found'); 
    }
  });
});

module.exports = router;