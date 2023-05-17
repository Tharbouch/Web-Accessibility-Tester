const User = require('../../Models/user')
const bcrypt = require('bcrypt')


const logUser = (req, res, next) => {
    const { username, password } = req.body

    User.findOne({ username })
        .exec()
        .then((response) => {
            if (response !== null) {
                bcrypt.compare(password, response.password)
                    .then((match) => {
                        if (match) {
                            res.status(200)
                                .json({
                                    userId: response._id,
                                    fullname: response.fullname,
                                    username: response.username,
                                })
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

}

const registerUser = (req, res, next) => {
    const { fullname, username, email, password } = req.body
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

const editUser = (req, res) => {
    const id = req.params.id

    if (condition) {
        User.findByIdAndUpdate(id, req.body.userInfo)
            .then((response) => {
                res.status(201)
                    .json({ message: "success" })
            }).catch((err) => {

                res.status(500)
                next(err)
            })


        res.status(401)
        next({ message: 'Unauthorized' })

    }

}

const deleteUser = (req, res) => {
    const id = req.params.id

    if (condition) {
        User.findByIdAndDelete(id)
            .then((response) => {
                res.status(201)
                    .json({ message: "success" })
            }).catch((err) => {
                res.status(500)
                next(err)
            })
    }
    else {
        res.status(401)
        next({ message: 'Unauthorized' })
    }
}


const passwordRecovery = (req, res) => {

}


module.exports = { logUser, registerUser, passwordRecovery, editUser, deleteUser }