// var express = require('express');
// var router = express.Router();
// var clubmodel = require('../../models/clubAPI');

// //DELETE USER ROUTE
// router.delete('/', (req, res) => {
//   clubmodel.clubDelete((result) => {
//     if (result) {
//       console.log('Club deleted successfully.');
//       res.status(200).send('Club deleted successfully.');
//     } else {
//       console.log('Failed to delete Club.');
//       res.status(404).send('Club not found'); 
//     }
//   });
// });

// module.exports = router;

// clubRouter.js
var express = require('express');
var router = express.Router();
var clubmodel = require('../../models/clubAPI');

// DELETE CLUB ROUTE
router.delete('/', (req, res) => {
  const email = req.body.email;

  clubmodel.clubDelete(email, (result) => {
    if (result) {
      console.log('Club deleted successfully.');
      res.status(200).send('Club deleted successfully.');
    } else {
      console.log('Failed to delete Club or Club not found.');
      res.status(404).send('Club not found or failed to delete Club.');
    }
  });
});

module.exports = router;