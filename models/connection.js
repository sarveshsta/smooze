var mongoose = require("mongoose");
var { URL } = require('../constants/constants');
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
    },

});
const users = mongoose.model('User', User);

//ONBOARDING SCHEMA
const OnBoarding = mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
    },
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
    Owner_name: {
        type: String,

    },
    Phone: {
        type: String,
        validate: {
            validator: function (value) {
                return /^[0-9]{10}$/.test(value);
            },
            message: 'Phone number must be 10 digits long.'
        },

    },
    email: {
        type: String,

    },
    password: {
        type: String,

    },
    Club_name: {
        type: String,

    },
    Club_Banner: {
        data: String,

    },
    Club_Docs: {
        type: String,

    },
    Owner_Aadhar: {
        type: String,

    },
    Owner_DP: {
        type: String,

    }
});
const clubs = mongoose.model('Clubs', Clubs);

const Menu = mongoose.Schema({
    categories: [
        {
            Club_name: {
                type: String,
                required: true
            },
            GivenMenu: {
                type: String,
                required: true
            },
            options: [
                {
                    name: {
                        type: String,
                        required: true
                    },
                    price: {
                        type: Number,
                        required : true
                    }
                }
            ]
        }
    ]
})
const menu = mongoose.model('Menu', Menu);

console.log("Successfully connected to mongodb database...");
module.exports = { db, users, onboardings, clubs, menu };