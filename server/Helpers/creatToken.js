const jwt = require("jsonwebtoken");

module.exports.createSecretToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.TOKEN_SECRET, {
        expiresIn: 3 * 24 * 60 * 60,
    });
};