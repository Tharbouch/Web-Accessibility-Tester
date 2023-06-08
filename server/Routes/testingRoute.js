const route = require('express').Router()
const accessibilityCheck = require('../Controllers/checkAccessibilty/test/checkAccessibility')
const getReport = require('../Controllers/checkAccessibilty/getReport/reportController')

route.get('/getReport', getReport)
route.post('/check-accessibility', accessibilityCheck);


module.exports = route