const User = require('../../Models/user')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const { createSecretToken } = require('../../Helpers/creatToken')

const logUser = (req, res, next) => {
    const { username, password, persist } = req.body

    if (req.headers['x-csrf-token'] === req.cookies._csrf) {
        User.findOne({ username })
            .exec()
            .then((response) => {
                if (response !== null) {
                    bcrypt.compare(password, response.password)
                        .then((match) => {
                            if (match) {
                                try {
                                    const token = createSecretToken(response.username, response.fullname, response._id)
                                    if (persist) {
                                        res
                                            .cookie('user', token, {
                                                maxAge: 1000 * 60 * 60 * 24 * 365,
                                                httpOnly: true,
                                                secure: true,
                                            })
                                            .status(200)
                                            .json({
                                                userID: response._id,
                                                fullname: response.fullname,
                                                username: response.username,
                                            })
                                    }
                                    else {
                                        res
                                            .cookie('user', token, {
                                                httpOnly: true,
                                                secure: true,
                                            })
                                            .status(200)
                                            .json({
                                                userID: response._id,
                                                fullname: response.fullname,
                                                username: response.username,
                                            })
                                    }

                                }
                                catch (error) {
                                    res.status(500)
                                    next(error)
                                }
                            }
                            else {
                                res.status(400)
                                next({ message: 'password incorrect' })
                            }
                        }).catch((err) => {
                            res.status(500)
                            next(err)
                        })
                }
                else {
                    res.status(400)
                    next({ message: 'username incorrect' })
                }
            })
            .catch((err) => {
                res.status(500)
                next(err)
            })
    } else {
        res.status(500)
        next({ message: "Something Went Wrong" })
    }

}

const registerUser = (req, res, next) => {
    const { fullname, username, email, password } = req.body

    if (req.headers['x-csrf-token'] === req.cookies._csrf) {

        User.find({ $or: [{ username: username }, { email: email }] })
            .exec()
            .then(async (response) => {
                if (response.length === 0) {
                    const salt = await bcrypt.genSalt(11);
                    bcrypt.hash(password, salt)
                        .then((hashedpassword) => {
                            User.create({ fullname, username, email, password: hashedpassword })
                                .then((respo) => {
                                    res.status(201)
                                        .json({ message: "success" })
                                }).catch((err) => {
                                    res.status(500)
                                    next(err)
                                })
                        })
                        .catch((err) => {
                            res.status(500)
                            next(err)
                        })
                }
                else {
                    res.status(400)
                    next({ message: 'user already exists' })
                }
            }).catch((err) => {
                res.status(500)
                next(err)
            })
    }
    else {
        res.status(401)
        next({ message: 'unauthorized' })
    }

}

const checkLogIn = (req, res, next) => {
    try {

        if (!req.cookies.user) {

            res.status(400).json({ logged: false });
        } else {
            jwt.verify(req.cookies.user, process.env.TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    console.log(err)
                    res.status(500)
                    next({ message: 'something went wrong' });
                } else {

                    res.status(200).json({ info: decoded, logged: true });
                }
            });
        }
    } catch (err) {
        console.log(err)
        res.status(400).json({ logged: false });
    }
};

const logout = (req, res) => {
    res.clearCookie('user').send()
};


const passwordRecovery = (req, res) => {

}


module.exports = { logUser, registerUser, checkLogIn, passwordRecovery, logout }