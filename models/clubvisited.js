const { db, users, clubs } = require('./connection');

function ClubVisitedModel() {

    //CLUB VISITED API
    this.clubvisited = (callback) => {
        db.collection("users").aggregate([
            {
                $lookup: {
                    from: "clubs",
                    localField: "location",
                    foreignField: "Club_name",
                    as: "Details",
                },
            },
        ]).toArray()
            .then((result) => {
                callback(result);
            })
            .catch((err) => {
                console.log(err);
            });
    }

}

module.exports = new ClubVisitedModel();