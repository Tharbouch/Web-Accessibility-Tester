const route = require('express').Router()
const csrf = require('csurf');

const csrfProtection = csrf({ cookie: false });

// Route to generate the CSRF token
route.get('/csrf-token', csrfProtection, (req, res) => {
    const csrfToken = req.csrfToken(); // Generate CSRF token
    res.json({ csrfToken }); // Send CSRF token to client
});

module.exports = route;