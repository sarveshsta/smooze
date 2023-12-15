const { sign, verify } = require('jsonwebtoken');

const createTokens = (users) => {
    const accessToken = sign(
        { name: users.name, uuid: users.uuid, phone : users.phone },
        "jwtsecretplschange"
    );

    return accessToken;
}

const createTokens1 = (messages) => {
    const accessToken = sign(
        { userEmail: messages.userEmail, uuid: messages.uuid },
        "jwtsecretplschange"
    );

    return accessToken;   
}

const createTokens2 = (userphotos) => {
    const accessToken = sign(
        { email : userphotos.email, uuid: userphotos.uuid },
        "jwtsecretplschange"
    );

    return accessToken;   
}

const createTokens3 = (clubs) => {
    const accessToken = sign(
        { email: clubs.email, uuid: clubs.uuid, Phone : clubs.Phone },
        "jwtsecretplschange"
    );

    return accessToken;   
}

const createTokens4 = (events) => {
    const accessToken = sign(
        { clubName: events.clubName, uuid: events.uuid, title : events.title },
        "jwtsecretplschange"
    );

    return accessToken;   
}

const createTokens5 = (profilequestion) => {
    const accessToken = sign(
        { userEmail: profilequestion.userEmail, uuid: profilequestion.uuid },
        "jwtsecretplschange"
    );

    return accessToken;   
}

const createTokens6 = (preferences) => {
    const accessToken = sign(
        { userEmail: preferences.userEmail, uuid: preferences.uuid },
        "jwtsecretplschange"
    );

    return accessToken;   
}

const createTokens7 = (userlikesomeones) => {
    const accessToken = sign(
        { UserEmail: userlikesomeones.UserEmail, uuid: userlikesomeones.uuid },
        "jwtsecretplschange"
    );

    return accessToken;   
}

const createTokens8 = (userdislikesomeones) => {
    const accessToken = sign(
        { UserEmail: userdislikesomeones.UserEmail, uuid: userdislikesomeones.uuid },
        "jwtsecretplschange"
    );

    return accessToken;   
}

const createTokens9 = (usersuperlikesomeones) => {
    const accessToken = sign(
        { UserEmail: usersuperlikesomeones.UserEmail, uuid: usersuperlikesomeones.uuid },
        "jwtsecretplschange"
    );

    return accessToken;   
}

const createTokens10 = (commentsomeones) => {
    const accessToken = sign(
        { UserEmail: commentsomeones.UserEmail, uuid: commentsomeones.uuid },
        "jwtsecretplschange"
    );

    return accessToken;   
}



module.exports = {
    createTokens,
    createTokens1,
    createTokens2,
    createTokens3,
    createTokens4,
    createTokens5,
    createTokens6,
    createTokens7,
    createTokens8,
    createTokens9,
    createTokens10,
};