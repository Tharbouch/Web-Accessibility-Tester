const jwt = require('jsonwebtoken');

function createSecretToken(email, username, fullname, userId) {
  return jwt.sign({ email, username, fullname, userId }, process.env.TOKEN_SECRET, {
    expiresIn: '15m', // short-lived access token
  });
}

/**
 * accepts a dynamic `expiresIn` parameter.
 * If not provided, defaults to '7d'.
 */
function createRefreshToken(email, username, fullname, userId, expiresIn = '7d') {
  console.log(email, username, fullname, userId, expiresIn);
  return jwt.sign({ email, username, fullname, userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn:expiresIn,
  });
}

module.exports = { createSecretToken, createRefreshToken };
