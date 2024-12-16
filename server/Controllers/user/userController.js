const User = require('../../Models/user')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const { createSecretToken, createRefreshToken } = require('../../Helpers/creatToken')

const logUser = async (req, res, next) => {
    const { username, password, persist } = req.body;

    if (req.headers['x-csrf-token'] === req.cookies._csrf) {
        try {
            const user = await User.findOne({ username }).exec();
            if (!user) {
                res.status(400);
                return next({ message: 'username incorrect' });
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                res.status(400);
                return next({ message: 'password incorrect' });
            }

            // Create short-lived access token
            const accessToken = createSecretToken(user.email, user.username, user.fullname, user._id);

            // Determine refresh token expiration based on persist
            const refreshExpiration = persist ? '365d' : '7d';

            // Use our updated helper function with dynamic expiration
            const refreshToken = createRefreshToken(user.email, user.username, user.fullname, user._id, refreshExpiration);

            // Cookies for access and refresh tokens
            res.cookie('user', accessToken, {
                httpOnly: true,
                secure: true,
            });

            const refreshMaxAge = persist ? 1000 * 60 * 60 * 24 * 365 : 1000 * 60 * 60 * 24 * 7;
            res.cookie('refresh', refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: refreshMaxAge,
            });

            return res.status(200).json({
                userID: user._id,
                fullname: user.fullname,
                username: user.username,
                persist
            });
        } catch (err) {
            res.status(500);
            return next(err);
        }
    } else {
        res.status(500);
        next({ message: "Something Went Wrong" });
    }
};


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
                                    res.status(201).json({ message: "success" })
                                }).catch((err) => {
                                    res.status(500)
                                    next(err)
                                })
                        })
                        .catch((err) => {
                            res.status(500)
                            next(err)
                        })
                } else {
                    res.status(400)
                    next({ message: 'user already exists' })
                }
            }).catch((err) => {
                res.status(500)
                next(err)
            })
    } else {
        res.status(401)
        next({ message: 'unauthorized' })
    }
}

const checkLogIn = (req, res, next) => {
    try {
        const accessToken = req.cookies.user;
        if (!accessToken) {
            return res.status(400).json({ logged: false });
        }

        jwt.verify(accessToken, process.env.TOKEN_SECRET, (err, decoded) => {
            if (err) {
                // If token is expired, let the client handle refresh
                if (err.name === 'TokenExpiredError') {
                    // Respond with a specific status or message so the client can trigger a refresh
                    return res.status(401).json({ logged: false, error: 'Access token expired' });
                }
                // Some other error
                return res.status(401).json({ logged: false, error: 'Invalid token' });
            }

            // If we reach here, access token is valid
            return res.status(200).json({ info: decoded, logged: true });
        });
    } catch (err) {
        console.log(err)
        res.status(400).json({ logged: false });
    }
};

const refreshToken = (req, res, next) => {
    const refreshToken = req.cookies.refresh;
    if (!refreshToken) {
        return res.status(401).json({ error: 'No refresh token provided' });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(401).json({ error: 'Invalid refresh token' });
        }

        // Refresh token is valid, issue a new access token
        const newAccessToken = jwt.sign({
            email: decoded.email,
            username: decoded.username,
            fullname: decoded.fullname,
            userId: decoded.userId
        }, process.env.TOKEN_SECRET, { expiresIn: '15m' });

        res.cookie('user', newAccessToken, {
            httpOnly: true,
            secure: true,
        });

        return res.status(200).json({ message: 'Token refreshed' });
    });
};

const logout = (req, res) => {
    res.clearCookie('user')
    res.clearCookie('refresh')
    return res.status(200).json({ message: 'Logged out successfully' });
};

// const passwordRecovery = (req, res) => {
//     const { email } = req.body;

//     // Generate a password reset token (you can use a library like crypto-random-string)
//     const token = createSecretToken(email, '', '', '', true);
//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: 'tahaharbouch01@gmail.com',
//             pass: 'web@ccessibility2000'
//         }
//     });
//     const mailOptions = {
//         from: 'tahaharbouch01@gmail.com',
//         to: email,
//         subject: 'Password Reset',
//         text: `Click the following link to reset your password: https://localhost/password-reset/${token}`
//     };

//     // Send the email
//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.error('Error sending email:', error);
//             res.status(500).json({ error: 'Failed to send password reset email' });
//         } else {
//             console.log('Email sent:', info.response);
//             res.status(200).json({ message: 'Password reset email sent successfully' });
//         }
//     });
// }

// const passwordReset = (req, res) => {
//     jwt.verify(req.body.token, process.env.TOKEN_SECRET, (err, decoded) => {
//         if (err) {
//             console.log(err)
//             res.status(500)
//             next({ message: 'something went wrong' });
//         } else {

//             User.findOneAndUpdate({ email: req.body.password }).then((response) => {
//                 res.status(200).json({ message: "updated" })
//             }).catch((err) => {
//                 console.log(err)
//                 res.status(500)
//                 next(err)
//             })
//         }
//     });

// }

module.exports = { logUser, registerUser, checkLogIn, refreshToken, logout }
