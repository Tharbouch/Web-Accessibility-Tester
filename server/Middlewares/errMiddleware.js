module.exports.errHandler = (err, req, res, next) => {

    const code = res.statusCode ? res.statusCode : 500
    const msg = code === 500 ? "Something Went Wrong" : err
    res.status(code)
        .json({
            message: msg,
            stack: process.env.ENV === 'dev' ? err.stack : null
        })
}

