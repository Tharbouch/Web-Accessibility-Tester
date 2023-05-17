const route = require('express').Router()
const accessibilityCheck = require('../Controllers/checkAccessibilty/checkAccessibility')


route.post('/check-accessibility', accessibilityCheck);


module.exports = route