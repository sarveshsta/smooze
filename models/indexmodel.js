const db = require('./connection');

function indexmodel() {
    this.registeruser = (userDetails, callback) => {
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
                    userDetails._id = max_id + 1
                } else {
                    userDetails._id = 1
                }
                var flag = 1
                if (result.length > 0) {
                    for (let row of result) {
                        if (userDetails.email == row.email) {
                            flag = 0
                            break
                        }
                    }
                }
                if (flag == 1) {
                    userDetails.status = 0
                    userDetails.role = "user"
                    userDetails.dt = Date()
                    db.collection("users").insertOne(userDetails, (err, result) => {
                        err ? console.log(err) : callback(true)
                    })
                } else {
                    callback(false)
                }
            }))
            .catch((err) => {
                console.log(err)
            })
    }
    this.userlogin = (userDetails, callback) => {
        db.collection('users').find({ "email": userDetails.email, "password": userDetails.password }).toArray()
            .then((result) => {
                callback(result)
            })
            .catch((err) => {
                console.log(err)
            })
    }

}

module.exports = new indexmodel();
