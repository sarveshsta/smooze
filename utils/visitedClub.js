function dem(users) {
    const usersByLocation = {};

    for (let i = 0; i < users.length; i++) {
        for (let j = i + 1; j < users.length; j++) {
            const user1 = users[i];
            const user2 = users[j];

            if (user1.location && user2.location && user1.location === user2.location) {
                const location = user1.location;

                // Initialize an array for the location if it doesn't exist
                if (!usersByLocation[location]) {
                    usersByLocation[location] = [];
                }

                // Check if the users are not already in the array before adding them
                if (!usersByLocation[location].includes(user1)) {
                    usersByLocation[location].push(user1);
                }

                if (!usersByLocation[location].includes(user2)) {
                    usersByLocation[location].push(user2);
                }
            }
        }
    }

    // log the users in each location
    for (const location in usersByLocation) {
        if (usersByLocation.hasOwnProperty(location)) {
            const usersInLocation = usersByLocation[location];

            console.log(`Users in ${location}:`);
            usersInLocation.forEach(user => {
                console.log(user);
            });

        }
    }


    // if no users were found in the same location
    if (Object.keys(usersByLocation).length === 0) {
        console.log('No users found in the same location.');
    }
}

module.exports = dem;
