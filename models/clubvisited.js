// const { db, users, clubs } = require('./connection');

// function ClubVisitedModel() {

//     //CLUB VISITED API
//     this.clubvisited = (callback) => {
//         db.collection("users").aggregate([
//             {
//                 $lookup: {
//                     from: "clubs",
//                     localField: "location",
//                     foreignField: "Club_name",
//                     as: "Details",
//                 },
//             },
//         ]).toArray()
//             .then((result) => {
//                 callback(result);
//             })
//             .catch((err) => {
//                 console.log(err);
//             });
//     }

// }

// module.exports = new ClubVisitedModel();

const { db, users, clubs } = require('./connection');

function ClubVisitedModel() {
    // CLUB VISITED API
    this.clubvisited = async (callback) => {
        try {
            const result = await db.collection("users").aggregate([
                {
                    $lookup: {
                        from: "clubs",
                        localField: "location",
                        foreignField: "Club_name",
                        as: "Details",
                    },
                },
            ]).toArray();

            callback(result);
        } catch (err) {
            console.error(err);
        }
    };
}

module.exports = new ClubVisitedModel();
