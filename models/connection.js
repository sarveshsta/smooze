var mongoose = require("mongoose");
var {URL} = require('../constants/constants');
const indianCities = require('indian-cities-database');

//DATABASE CONNECTIVITY 
mongoose.connect(URL);
var db = mongoose.connection;

const cities = indianCities.cities
const states = [...new Set(cities.map(city => city.state))];
const cities1 = [...new Set(cities.map(city => city.city))];
// console.log('Available states:', states);
// console.log('Available cities:', cities1);

// USER SCHEMA
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
    }
});
const users = mongoose.model('User', User);

//ONBOARDING SCHEMA
const OnBoarding = mongoose.Schema({
    questions: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true
    },
    OptedOption: {
        type: [String],
        required: true
    }
});
const onboardings = mongoose.model('OnBoarding', OnBoarding);

//CLUB SCHEMA
const Clubs = mongoose.Schema({
    Owner_name : {
        type: String,
        required: true
    },
    Phone : {
        type: String,
        validate: {
            validator: function (value) {
                return /^[0-9]{10}$/.test(value);
            },
            message: 'Phone number must be 10 digits long.'
        },
        required: true
    },
    email : {
        type: String,
        required: true
    },
    password : {
        type : String,
        required : true
    },
    Club_name : {
        type: String,
        required: true
    },
    Club_Banner : {
        type : String,
        required : true
    },
    Club_Docs : {
        type : String,
        required : true
    },
    Owner_Aadhar : {
        type : String,
        required : true
    },
    Owner_DP : {
        type : String,
        required : true
    } 
});
const clubs = mongoose.model('Clubs',Clubs);

console.log("Successfully connected to mongodb database...");
module.exports = { db, users, onboardings, clubs};