const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
const connectDB = () => {
    mongoose.connect(process.env.DB_URI)
        .then((response) => {
            console.log(`connected successfully to ${response.connection.host}`)
        }).catch((err) => {
            console.log(err)
            process.exit(1)
        })
}

module.exports = connectDB