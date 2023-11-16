const questions = require('../routes/onBoardRoute/onboarding');

function calculateCompatibilityForAllUsers(users) {
    const compatibilityMatrix = [];

    const weights = [0.2, 0.2, 0.2, 0.2, 0.2]; // Weights for each question

    for (let i = 0; i < users.length; i++) {
        for (let j = i + 1; j < users.length; j++) {
            const user1 = users[i];
            const user2 = users[j];

            let compatibilityScore = 0;

            // Iterate through each question and calculate compatibility
            for (let q = 0; q < questions.length; q++) {
                const user1Answer = user1.Details.find(detail => detail[`question${q + 1}`]);
                const user2Answer = user2.Details.find(detail => detail[`question${q + 1}`]);

                // Check if both users have provided an answer for the question
                if (user1Answer && user2Answer) {
                    // Check if the answers are the same
                    if (user1Answer.OptedOption[0] === user2Answer.OptedOption[0]) {
                        compatibilityScore += weights[q];
                    }
                }
            }

            compatibilityMatrix.push({
                user1: user1.name,
                user2: user2.name,
                compatibilityPercentage: compatibilityScore * 100,
            });
        }
    }

    return compatibilityMatrix;
}

module.exports = calculateCompatibilityForAllUsers;
