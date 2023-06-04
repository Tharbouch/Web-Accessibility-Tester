const route = require('express').Router()
const Tokens = require('csrf');

route.get('/csrf-token', (req, res) => {
    const tokens = Tokens()
    const secret = tokens.secretSync()
    const token = tokens.create(secret)
    res.json({ csrfToken: token });
});


module.exports = route