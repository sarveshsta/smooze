const  {sign,verify} = require('jsonwebtoken');

const createTokens = (users) =>{
    const accessToken = sign(  
        {name : users.name, _id : users._id},
        "jwtsecretplschange"
    );

    return accessToken;
}

module.exports = createTokens;