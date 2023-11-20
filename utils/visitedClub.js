function dem(users) {

    for (let i = 0; i < users.length; i++) {
        for (let j = i + 1; j < users.length; j++) {
            const user1 = users[i];
            const user2 = users[j];

            // if (user1.entrytime && user2.entrytime || user1.exit_time === user2.exit_time) {
                if (user1.location && user2.location) {
                    if (user1.location === user2.location) {
                        console.log(user1);
                        console.log(user2);
                        console.log('Users on club:', user1.location);
                    }
                }
            // }
        }
    }

}


module.exports = dem;