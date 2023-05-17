const route = require('express').Router()
const controller = require('../Controllers/user/userController')


route.post('/login', controller.logUser)
route.post('/register', controller.registerUser)
route.post('/password-recovery', controller.passwordRecovery)
route.put('/edit/:id', controller.editUser)
route.delete('/delete/:id', controller.deleteUser)

module.exports = route