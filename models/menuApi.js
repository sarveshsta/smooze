// const { db, menu } = require('./connection');
// const crypto = require('crypto');

// function MenuModel() {

//     //clubMenu api
//     this.clubMenu = (menu, Club_name, selectedOptions, callback) => {
//         db.collection("menu").find().toArray()
//             .then((val => {
//                 console.log(val);
//                 var result = val;
//                 if (result.length > 0) {
//                     var max_id = result[0]._id;
//                     for (let row of result) {
//                         if (max_id < row._id) {
//                             max_id = row._id;
//                         }
//                     }
//                     menu._id = max_id + 1;
//                 } else {
//                     menu._id = 1;
//                 }
//                 var flag = 1;
//                 if (result.length > 0) {
//                     for (let row of result) {
//                         if (menu._id == row._id) {
//                             flag = 0;
//                             break;
//                         }
//                     }
//                 }

//                 let uuid = crypto.randomUUID();

//                 if (flag == 1) {
//                     menu.OptedMenu = selectedOptions
//                     menu.Club_name = Club_name
//                     menu.uuid = uuid
//                     menu.dt = Date();
//                     db.collection("menu").insertOne(menu, (err, result) => {
//                         if (err) {
//                             console.log(err);
//                             callback(false);
//                         } else {
//                             callback(true);
//                         }
//                     });
//                 } else {
//                     callback(false);
//                 }
//             }))
//             .catch((err) => {
//                 console.log(err);
//                 callback(false);
//             });
//     }





//     //add club and menu model together
//     this.getClubMenuDetails = (callback) => {
//         db.collection("clubs").aggregate([
//             {
//                 $lookup: {
//                     from: "menu",
//                     localField: "Club_name",
//                     foreignField: "Club_name",
//                     as: "Details",
//                 },
//             },
//         ]).toArray()
//             .then((data) => {
//                 callback(data);
//                 console.log(data)
//             })
//             .catch((err) => {
//                 console.log(err);
//                 callback([]);
//             })
//     };


    




//     //api for update menu
//     this.updatePrice = (menu, OptedMenu, callback) => {
//         db.collection("menu").find({Club_name : menu.Club_name}).toArray()
//             .then((result) => {
//                 console.log(result)
//                 if (result.length > 0) {
//                     db.collection('menu').updateOne({Club_name : menu.Club_name}, { $set: { OptedMenu: OptedMenu } })
//                         .then(() => {
//                             console.log('menu updated successfully');
//                             callback(result);
//                         })
//                         .catch((updateErr) => {
//                             console.log('Error updating Club menu:', updateErr);
//                             callback([]);
//                         });
//                 } else {
//                     console.log('Club menu not found.');
//                     callback([]);
//                 }
//             })
//             .catch((err) => {
//                 console.log('Error:', err);
//                 callback([]);
//             });
//     }


// }


// module.exports = new MenuModel();

const { db, menu } = require('./connection');
const crypto = require('crypto');

function MenuModel() {
    // clubMenu api
    this.clubMenu = async (menus, Club_name, selectedOptions, callback) => {
        try {
            const val = await db.collection("menus").find().toArray();
            console.log(val);
            var result = val;
            if (result.length > 0) {
                var max_id = result[0]._id;
                for (let row of result) {
                    if (max_id < row._id) {
                        max_id = row._id;
                    }
                }
                menus._id = max_id + 1;
            } else {
                menus._id = 1;
            }
            var flag = 1;
            if (result.length > 0) {
                for (let row of result) {
                    if (menus._id == row._id) {
                        flag = 0;
                        break;
                    }
                }
            }

            let uuid = crypto.randomUUID();

            if (flag == 1) {
                menus.OptedMenu = selectedOptions;
                menus.Club_name = Club_name;
                menus.uuid = uuid;
                menus.dt = Date();
                await db.collection("menus").insertOne(menus);
                callback(true);
            } else {
                callback(false);
            }
        } catch (err) {
            console.log(err);
            callback(false);
        }
    }

    // add club and menu model together
    this.getClubMenuDetails = async (callback) => {
        try {
            const data = await db.collection("clubs").aggregate([
                {
                    $lookup: {
                        from: "menus",
                        localField: "Club_name",
                        foreignField: "Club_name",
                        as: "Details",
                    },
                },
            ]).toArray();
            callback(data);
            console.log(data);
        } catch (err) {
            console.log(err);
            callback([]);
        }
    };

    // api for update menu
    this.updatePrice = async (menus, OptedMenu, callback) => {
        try {
            const result = await db.collection("menus").updateOne(
                { Club_name: menus.Club_name },
                { $set: { OptedMenu: OptedMenu } }
            );
            if (result.modifiedCount > 0) {
                console.log('menu updated successfully');
                callback(result);
            } else {
                console.log('Club menu not found.');
                callback([]);
            }
        } catch (err) {
            console.log('Error:', err);
            callback([]);
        }
    }
}

module.exports = new MenuModel();
