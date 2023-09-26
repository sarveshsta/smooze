const { db, User } = require('./connection');
const indianCities = require('indian-cities-database');
const cities = indianCities.cities
const states = [...new Set(cities.map(city => city.state))];
const cities1 = [...new Set(cities.map(city => city.city))];

// console.log('Available states:', states);
// console.log('Available cities:', cities1);
// console.log(cities);

function indexmodel() {

    this.registeruser = (User, callback) => {
        // if (!/^[0-9]{10}$/.test(User.phone)) {
        //     callback(false, { "msg": '' });
        //     return;
        // }

        // if (!['Male', 'Female', 'Other'].includes(User.gender)) {
        //     callback(false, { "msg-gen": '' });
        //     return;
        // }

        // if (!states.includes(User.state)) {
        //     callback(false, { "msgState": '' });
        //     return;
        // }

        // if (!cities1.some(city => city.name === User.city && city.state === User.state)) {
        //     callback(false, { "msgCity": '' });
        //     return;
        // }

        db.collection("users").find().toArray()
            .then((val => {
                console.log(val)
                var result = val
                if (result.length > 0) {
                    var max_id = result[0]._id
                    for (let row of result) {
                        if (max_id < row._id) {
                            max_id = row._id
                        }
                    }
                    User._id = max_id + 1
                } else {
                    User._id = 1
                }
                var flag = 1
                if (result.length > 0) {
                    for (let row of result) {
                        if (User.email == row.email) {
                            flag = 0
                            break
                        }
                    }
                }
                if (flag == 1) {
                    User.status = 0
                    User.role = "user"
                    User.dt = Date()
                    User.Isactive = {
                        type: Boolean,
                        default: false,
                    }
                    db.collection("users").insertOne(User, (err, result) => {
                        if (err) {
                            console.log(err)
                            callback(false)
                        }
                        else {
                            db.collection('users').updateOne({ email: User.email }, { $set: { Isactive: true } })
                                .then(() => {
                                    console.log('User marked as active.');
                                    callback(true);
                                })
                                .catch((updateErr) => {
                                    console.log('Error updating user status:', updateErr);
                                    callback(false);
                                });
                        }
                    })
                } else {
                    callback(false)
                }
            }))
            .catch((err) => {
                console.log(err)
            })
    }

    this.userlogin = (User, callback) => {
        db.collection('users').find({ email: User.email, password: User.password }).toArray()
            .then((result) => {
                if (result.length > 0) {
                    const user = result[0];
                    if (!user.Isactive) {
                        // Activate the user
                        db.collection('users').updateOne({ email: User.email }, { $set: { Isactive: true } })
                            .then(() => {
                                console.log('User activated.');
                            })
                            .catch((updateErr) => {
                                console.log('Error activating user:', updateErr);
                            });
                    }
                    callback(result);
                } else {
                    console.log('User not found.');
                    callback([]);
                }
            })
            .catch((err) => {
                console.log('Error:', err);
                callback([]);
            });
    }

    this.deactivateUser = (User, callback) => {
        db.collection('users').updateOne({ email: User.email, password: User.password }, { $set: { Isactive: false } })
            .then((result) => {
                // console.log('User deactivated.');
                callback(result);
            })
            .catch((updateErr) => {
                console.log('Error deactivating user:', updateErr);
                callback(false);
            });
    }

    // this.deleteuser = (User,callback)=>{
    //     db.collection('users').deleteOne({email : User.email,password:User.password})
    //     .then((result) => {
    //         result.deletedCount+=1;
    //         callback(result);
    //         console.log(result);
    //     }).catch((err) => {
    //         console.log(err);
    //     });
    // }
    
}

module.exports = new indexmodel();
