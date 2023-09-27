const { db, users } = require('./connection');
const indianCities = require('indian-cities-database');
const cities = indianCities.cities
const states = [...new Set(cities.map(city => city.state))];
const cities1 = [...new Set(cities.map(city => city.city))];

// console.log('Available states:', states);
// console.log('Available cities:', cities1);
// console.log(cities);

function indexmodel() {

    this.registeruser = (users, callback) => {
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
                    users._id = max_id + 1
                } else {
                    users._id = 1
                }
                var flag = 1
                if (result.length > 0) {
                    for (let row of result) {
                        if (users.email == row.email) {
                            flag = 0
                            break
                        }
                    }
                }
                if (flag == 1) {
                    users.status = 0
                    users.role = "user"
                    users.dt = Date()
                    users.Isactive = {
                        type: Boolean,
                        default: false,
                    }
                    db.collection("users").insertOne(users, (err, result) => {
                        if (err) {
                            console.log(err)
                            callback(false)
                        }
                        else {
                            db.collection('users').updateOne({ email: users.email }, { $set: { Isactive: true } })
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

    this.userlogin = (users, callback) => {
        db.collection('users').find({ email: users.email, password: users.password }).toArray()
            .then((result) => {
                if (result.length > 0) {
                    const user = result[0];
                    if (!user.Isactive) {
                        // Activate the user
                        db.collection('users').updateOne({ email: users.email }, { $set: { Isactive: true } })
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

    this.deactivateUser = (users, callback) => {
        db.collection('users').updateOne({ email: users.email, password: users.password }, { $set: { Isactive: false } })
            .then((result) => {
                // console.log('User deactivated.');
                callback(result);
            })
            .catch((updateErr) => {
                console.log('Error deactivating user:', updateErr);
                callback(false);
            });
    }

    this.deleteuser = (users,callback)=>{
        db.collection('users').deleteOne({email : users.email,password:users.password})
        .then((result) => {
            callback(result);
        }).catch((err) => {
            console.log(err);
        });
    }
    
}

module.exports = new indexmodel();
