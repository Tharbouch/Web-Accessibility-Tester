const { Schema, model } = require('mongoose')


const userSchema = Schema({
    username: {
        type: String,

        required: true
    },
    fullname: {
        type: String,

        required: true
    },
    email: {
        type: String,

        required: true
    },
    password: {
        type: String,

        required: true
    },
});

const User = model('user', userSchema);

module.exports = User;