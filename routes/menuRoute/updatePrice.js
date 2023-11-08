// var express = require('express');
// var router = express.Router();
// var MenuModel = require('../../models/menuApi');

// //FORGOTPASSWORD ROUTE

// router.post('/', function (req, res, next) {
//     const OptedMenu = req.body.OptedMenu
//     MenuModel.updatePrice(req.body,OptedMenu,(result) => {
//         if (result) {
//             console.log('menu updated successfully');
//             res.send('menu updated successfully');
            
//         } else {
//             console.log('Error while updating menu');
//         }
//     });
// });

// module.exports = router;

var express = require('express');
var router = express.Router();
var MenuModel = require('../../models/menuApi');

//update price ROUTE

router.post('/', function (req, res, next) {
    const OptedMenu = req.body.OptedMenu
    MenuModel.updatePrice(req.body, OptedMenu, (result) => {
        if (result.length > 0) {
            res.send('menu updated successfully');
        } else {
            console.log('Error while updating menu');
            res.send('Error while updating menu');
        }
    });
});

module.exports = router;