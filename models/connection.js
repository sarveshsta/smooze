var mongoose = require("mongoose");
var url = require('../constants/constants');
const indianCities = require('indian-cities-database');

mongoose.connect(url);
var db = mongoose.connection;

const cities = indianCities.cities
const states = [...new Set(cities.map(city => city.state))];
const cities1 = [...new Set(cities.map(city => city.city))];
// console.log('Available states:', states);
// console.log('Available cities:', cities1);
const User = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Others"]
    },
    phone: {
        type: String,
        validate: {
            validator: function (value) {
                return /^[0-9]{10}$/.test(value);
            },
            message: 'Phone number must be 10 digits long.'
        },
        required: true
    },
    state: {
        type: String,
        enum: states
    },
    city: {
        type: String,
        validate: {
            validator: function (value) {
                return cities1.some(city => city.name === value);
            },
            message: 'Invalid city.'
        }
    },
});

const users = mongoose.model('User', User);

console.log("Successfully connected to mongodb database...");
module.exports = { db, users };