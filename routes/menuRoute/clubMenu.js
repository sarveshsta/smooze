var express = require('express');
var router = express.Router();
const MenuModel = require('../../models/menuApi');

let currentMenuIndex = 0;


// clubMenu route
const GivenMenu = [
    {
        Drinks: "What Drinks do you have?",
        options: [
            "Beer",
            "Lager Beer",
            "Wine",
            "Whiskey",
            "Scotch",
            "Vodka",
            "Bourbon"
        ]
    },
    {
        FoodItems: "what food  do  you  have?",
        options: [
            "manchurian",
            "momo",
            "French Fries",
            "Garlic Breads",
            "pizza",
            "Burger"
        ]
    }
];



// clubMenu ROUTE
router.post('/', (req, res, next) => {
    const currentItem = GivenMenu[currentMenuIndex];
    const selectedOptions = req.body.OptedMenu;
    const Club_name = req.body.Club_name
    MenuModel.clubMenu(currentItem, Club_name,selectedOptions, (result) => {
        console.log("Result :", result);
        if (result) {
            console.log("Menu submitted");
            console.log("Opted Menu:-", selectedOptions);
            // Move to the next menu section
            currentMenuIndex++;
            if (currentMenuIndex < GivenMenu.length) {
                console.log("Moving to the next MenuItem...");
                console.log(GivenMenu[currentMenuIndex]);
                res.status(200).json({ message: "Moving to the next Item..." });
            } else {
                currentMenuIndex = 0;
                console.log("All Menu Item submitted.");
                res.status(200).json({ message: "All Menu Item submitted." });
            }
        } else {
            console.log('Failed in submitting Menu');
            res.status(400).json({ message: "Failed to submit the Menu." });
        }
    });
});



module.exports = router;