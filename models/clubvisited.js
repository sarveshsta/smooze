const { db, users, clubs } = require('./connection');

function ClubVisitedModel() {

    //CLUB VISITED API
    this.clubvisited = (callback) => {
        db.collection("users").aggregate([
            {
                $lookup: {
                    from: "clubs",
                    localField: "email",
                    foreignField: "email",
                    as: "Details",
                },
            },
        ]).toArray()
            .then((data) => {
                callback(data);
                console.log(data)
            })
            .catch((err) => {
                console.log(err);
            })
    }

    
}

module.exports = new ClubVisitedModel();