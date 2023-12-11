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
    location: {
        type: String,
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


//USER PHOTOS SCHEMA
const UserPhotos = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    image1: {
        type: String,
        required: true
    },
    image2: {
        type: String,
        required: true
    },
    image3: {
        type: String,
        required: true
    },
    image4: {
        type: String,
        required: true
    }
});
const userphotos = mongoose.model('UserPhotos', UserPhotos);



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
        type: String,
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


//Menu Schema
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
                        required: true
                    }
                }
            ]
        }
    ]
})
const menu = mongoose.model('Menu', Menu);


//Event Model
const Event = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    clubName: {
        type: String,
        required: true
    },
    addphotos: {
        type: String,
    },
    addphotos1: {
        type: String,
    },
    addphotos2: {
        type: String,
    },
    event_description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    }
})
const events = mongoose.model('Event', Event);


//USER PROFILE QUESTION API
const ProfileQuestions = mongoose.Schema({
    userEmail: {
        type: String,
        required: true
    },
    Intrest: [
        {
            type: [String],
            required: true
        }
    ],
    Language: [
        {
            type: [String],
            required: true
        }
    ],
    Education: {
        type: String,
        required: true
    },
    Work: {
        type: String,
        required: true
    },
    Bio: {
        type: String,
        required: true
    },
    Height: {
        type: Number,
        required: true
    },
    StarSign: {
        type: String,
        required: true
    }
})
const profilequestion = mongoose.model('ProfileQuestions', ProfileQuestions);


//USER PREFERENCE Schema
const Preferences = mongoose.Schema({
    userEmail: {
        type: String,
        required: true
    },
    min_age: {
        type: String,
        required: true
    },
    max_age: {
        type: String,
        required: true
    },
    DistanceRadius: {
        type: Number,
        required: true
    }
})
const preferences = mongoose.model('Preferences', Preferences);


//OFFER SMOOZ Schema
const OfferSmooz = mongoose.Schema({
    OfferSmoozEmail: {
        type: String,
        required: true
    },
    UserEmail: {
        type: String,
        required: true
    },
    itemOffered: [
        {
            name: {
                type: String,
                required: true
            },
            price: {
                type: String,
                requried: true
            }
        }
    ],
    option: {
        type: String,
        required: true
    }
})
const offersmoozs = mongoose.model('OfferSmooz', OfferSmooz);

//Schema of user like someone
const UserLikeSomeOne = mongoose.Schema({
    UserEmail: {
        type: String,
        required: true
    },
    isLiked: {
        type: Boolean,
        requried: true,
        default: false
    },
    LikedTo: {
        type: String,
        required: true
    }
})
const userlikesomeones = mongoose.model('UserLikeSomeOne', UserLikeSomeOne);

//Schema of user  Dislike someone
const UserDisLikeSomeOne = mongoose.Schema({
    UserEmail: {
        type: String,
        required: true
    },
    isLiked: {
        type: Boolean,
        requried: true,
        default: false
    },
    DisLikedTo: {
        type: String,
        required: true
    }
})
const userdislikesomeones = mongoose.model('UserDisLikeSomeOne', UserDisLikeSomeOne);

//Schema of user super like someone 
const UserSuperLikeSomeOne = mongoose.Schema({
    UserEmail: {
        type: String,
        required: true
    },
    isLiked: {
        type: Boolean,
        requried: true,
        default: false
    },
    SuperLikedTo: {
        type: String,
        required: true
    }
})
const usersuperlikesomeones = mongoose.model('UserSuperLikeSomeOne', UserSuperLikeSomeOne);


//Schema of Comment user
const CommentSomeone = mongoose.Schema({
    UserEmail: {
        type: String,
        required: true
    },
    CommentTo: {
        type: String,
        required: true
    },
    Comment: {
        type: String,
        required: true
    }
})
const commentsomeones = mongoose.model('CommentSomeone', CommentSomeone);


//Schema for message
const Message = mongoose.Schema({
    userEmail: {
        type: String,
        required: true
    },
    recipientEmail: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
})
const messages = mongoose.model('Message', Message);

//Schema for order
const Order = mongoose.Schema({
    amount : {
        type : Number,
        required : true
    }
})
const orders = mongoose.model('Order',Order);


console.log("Successfully connected to mongodb database...");

module.exports = {
    db,
    users,
    userphotos,
    onboardings,
    clubs,
    menu,
    events,
    profilequestion,
    preferences,
    offersmoozs,
    userlikesomeones,
    userdislikesomeones,
    usersuperlikesomeones,
    commentsomeones,
    messages,
    orders
};