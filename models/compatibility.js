const { db, users, onboardings} = require('./connection');

function CompatibleModle() {

    this.UserCompatibility = (callback) => {
        db.collection("users").aggregate([
            {
                $lookup: {
                    from: "onboardings",
                    localField: "email",
                    foreignField: "userEmail",
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
    };
}

module.exports = new CompatibleModle();