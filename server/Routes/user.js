const route = require('express').Router();
const controller = require('../Controllers/user/userController');


route.post('/login', controller.logUser);
route.post('/register', controller.registerUser);
route.get('/loggedIn', controller.checkLogIn);
route.get('/refresh',controller.refreshToken);
route.post('/logout', controller.logout);
// route.post('/password-recovery', controller.passwordRecovery) will be fixed later

module.exports = route