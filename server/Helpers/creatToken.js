const jwt = require("jsonwebtoken");

module.exports.createSecretToken = (username, fullname, userID) => {
    return jwt.sign({ username, fullname, userID }, process.env.TOKEN_SECRET);
};