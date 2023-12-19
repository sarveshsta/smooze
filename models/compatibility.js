// const { db, users, onboardings} = require('./connection');

// function CompatibleModle() {

//     //USER COMPATIBILITY API
//     this.UserCompatibility = (callback) => {
//         db.collection("users").aggregate([
//             {
//                 $lookup: {
//                     from: "onboardings",
//                     localField: "email",
//                     foreignField: "userEmail",
//                     as: "Details",
//                 },
//             },
//         ]).toArray()
//             .then((data) => {
//                 callback(data);
//                 // console.log(data)
//             })
//             .catch((err) => {
//                 console.log(err);
//             })
//     };

    
// }

// module.exports = new CompatibleModle();

const { db, users, onboardings } = require('./connection');

function CompatibleModel() {
    // USER COMPATIBILITY API
    this.UserCompatibility = async (callback) => {
        try {
            const data = await db.collection("users").aggregate([
                {
                    $lookup: {
                        from: "onboardings",
                        localField: "email",
                        foreignField: "userEmail",
                        as: "Details",
                    },
                },
            ]).toArray();

            callback(data);
        } catch (err) {
            console.error(err);
        }
    };
}

module.exports = new CompatibleModel();
