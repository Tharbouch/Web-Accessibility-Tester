const route = require('express').Router()
const accessibilityCheck = require('../controllers/checkAccessibilty/checkAccessibility')


route.get('/check-accessibility', accessibilityCheck);


module.exports = route