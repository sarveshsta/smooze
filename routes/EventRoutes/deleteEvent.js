var express = require('express');
var router = express.Router();
var eventmodel = require('../../models/EventApi');

//DELETE USER ROUTE
router.delete('/', (req, res) => {
  eventmodel.deleteEvent(req.body, (result) => {
    if (result){
      console.log('Event deleted successfully.');
      res.status(200).send('Event deleted successfully.');
    } else {
      console.log('Failed to delete Event.');
      res.status(500).render('error');
    }
  });
});

module.exports = router;



