const jwt = require("jsonwebtoken");

module.exports.createSecretToken = (email,username, fullname, userID,condition) => {
    if (condition) {
        
    return jwt.sign({ username, fullname, userID }, process.env.TOKEN_SECRET);
    }
    else{
        return jwt.sign({email}, process.env.TOKEN_SECRET,{ expiresIn: '15m' });
    }
};