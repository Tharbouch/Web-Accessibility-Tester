const Audit = require('../../../Models/audit')


const getReport = (req, res, next) => {
    const { userID } = req.query
    Audit.find({ owner: userID })
        .exec()
        .then((response) => {
            res.json(response)
        })
        .catch((err) => {
            res.status(500)
            next(err)
        })
}

module.exports = getReport