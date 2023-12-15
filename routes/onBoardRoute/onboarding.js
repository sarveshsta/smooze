var express = require('express');
var router = express.Router();
var onboardModel = require('../../models/onBoardingApi');

let currentQuestionIndex = 0;

//ONBOARDING QUESTIONS

const questions = [
    {
        question1: "If Jadoo was your bartender today, what would you like to drink?",
        options:
            [
                "Beer",
                "Lager Beer",
                "Wine",
                "Whiskey",
                "Scotch",
                "Vodka",
                "Bourbon"
            ],

    },
    {
        question2: "When I’m drunk, I’m most likely to_____",
        options:
            [
                "Dance like no one’s looking",
                "Eat Eat Eat",
                "Upload my Insta and Fb Feeds"
            ],

    },
    {
        question3: "What do you look for in the club?",
        options:
            [
                "I’m a lone wolf at the club! ",
                "I’m looking for a partner ",
                "Chillin with my friends",
                "I’m here to get drunk!"
            ],

    },
    {
        question4: "How often do you go to the club?",
        options:
            [
                "Only Weekends",
                "Very Often",
                "Rarely",
                "Only in Ladies night"
            ],

    },
    {
        question5: "Which of the club personalities are you?",
        options:
            [
                "Loves to approach people in the club",
                "Loves to get approached",
                "None of the above "
            ],

    }
];

// ONBOARDING ROUTE

router.post('/', (req, res, next) => {
    const currentQuestion = questions[currentQuestionIndex];
    const selectedOptions = req.body.options;
    const userEmail = req.body.userEmail
    onboardModel.onboardingQuestion(currentQuestion, userEmail,selectedOptions, (result) => {
        console.log("Result :", result);
        if (result) {
            console.log("Onboarding question submitted");
            console.log("User Opted Options:-", selectedOptions);
            // Move to the next question
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                console.log("Moving to the next question...");
                console.log(questions[currentQuestionIndex]);
                res.status(200).json({ message: "Moving to the next question..." });
            } else {
                console.log("All questions submitted.");
                res.status(200).json({ message: "All questions submitted." });
            }
        } else {
            console.log('Failed in submitting onboarding question');
            res.status(400).json({ message: "Failed to submit the question." });
        }
    });
});


module.exports = router,questions;












