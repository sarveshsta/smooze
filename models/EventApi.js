const { db, clubs, events } = require('./connection');

function eventmodel() {

    //add event api
    this.addEvent = (events, addphotos, addphotos1, addphotos2,accessToken, callback) => {
        db.collection("events").find().toArray()
            .then((val) => {
                console.log(val);
                var result = val;
                let max_id = 0;
                if (result.length > 0) {
                    max_id = Math.max(...result.map((row) => row._id));
                }
                events._id = max_id + 1;

                let flag = 1;
                if (result.length > 0) {
                    for (let row of result) {
                        if (events.title == row.title) {
                            flag = 0;
                            break;
                        }
                    }
                }

                if (flag == 1) {
                    events.addphotos = addphotos
                    events.addphotos1 = addphotos1
                    events.addphotos2 = addphotos2
                    events.dt = new Date();
                    events.token = accessToken;
                    db.collection("events").insertOne(events, (err) => {
                        if (err) {
                            console.log(err);
                            callback(false);
                        } else {
                            callback(true)
                        }
                    });
                } else {
                    callback(false);
                }
            })
            .catch((err) => {
                console.log(err);
                callback(false);
            });
    }





    //delete event api
    this.deleteEvent = (events, callback) => {
        db.collection('events').deleteOne({ clubName: events.clubName, title: events.title })
            .then((result) => {
                if (result.length > 0) {
                    callback(result);
                } else {
                    console.log('Event not found.');
                    callback([]);
                }

            }).catch((err) => {
                console.log(err);
            });
    }





    //update event date api
    this.updateEventDate = (events, updateDate, callback) => {
        db.collection("events").find({ clubName: events.clubName,title: events.title }).toArray()
            .then((result) => {
                console.log(result)
                if (result.length > 0) {
                    db.collection('events').updateOne({ clubName: events.clubName,title: events.title}, { $set: { date: updateDate } })
                        .then(() => {
                            console.log('Date updated successfully');
                            callback(result);
                        })
                        .catch((updateErr) => {
                            console.log('Error while updating new Date:', updateErr);
                            callback([]);
                        });
                } else {
                    console.log('Event not found.');
                    callback([]);
                }
            })
            .catch((err) => {
                console.log('Error:', err);
                callback([]);
            });
    }





    //update event time api
    this.updateEventTime = (events, updateTime, callback) => {
        db.collection("events").find({ clubName: events.clubName,title: events.title }).toArray()
            .then((result) => {
                console.log(result)
                if (result.length > 0) {
                    db.collection('events').updateOne({ clubName: events.clubName,title: events.title}, { $set: { time: updateTime } })
                        .then(() => {
                            console.log('Time updated successfully');
                            callback(result);
                        })
                        .catch((updateErr) => {
                            console.log('Error while updating new Time:', updateErr);
                            callback([]);
                        });
                } else {
                    console.log('Event not found.');
                    callback([]);
                }
            })
            .catch((err) => {
                console.log('Error:', err);
                callback([]);
            });
    }







    //update event description api
    this.updateEventDescription = (events, updateDescription, callback) => {
        db.collection("events").find({ clubName: events.clubName,title: events.title }).toArray()
            .then((result) => {
                console.log(result)
                if (result.length > 0) {
                    db.collection('events').updateOne({ clubName: events.clubName , title: events.title}, { $set: { event_description: updateDescription } })
                        .then(() => {
                            console.log('event_description updated successfully');
                            callback(result);
                        })
                        .catch((updateErr) => {
                            console.log('Error while updating event_description:', updateErr);
                            callback([]);
                        });
                } else {
                    console.log('Event not found.');
                    callback([]);
                }
            })
            .catch((err) => {
                console.log('Error:', err);
                callback([]);
            });
    }



    


    //adding club and event model together
    this.getClubEvents = (callback) => {
        db.collection("clubs").aggregate([
            {
                $lookup: {
                    from: "events",
                    localField: "Club_name",
                    foreignField: "clubName",
                    as: "All Events",
                },
            },
        ])
            .toArray()
            .then((data) => {
                callback(data);
                console.log(data)
            })
            .catch((err) => {
                console.log(err);
                callback([]);
            })
    }




}

module.exports = new eventmodel();