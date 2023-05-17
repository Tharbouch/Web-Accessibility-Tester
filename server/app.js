const cors = require('cors')
const express = require('express')
const http = require('http')
const dovenv = require('dotenv').config()
const { errHandler } = require('./Middlewares/errMiddleware')
const accessibilityCheckRoutes = require('./Routes/testingRoute')
const UserRoutes = require('./Routes/user')
const connectDb = require('./Helpers/connectDB')


const app = express()
const server = http.createServer(app)
connectDb()


// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


//Routes

app.use('/api/v1/', accessibilityCheckRoutes)
app.use('/api/v1/user', UserRoutes)

//err middleware

app.use(errHandler)



//server run
server.listen(process.env.PORT || 4000, () => {
    console.log(`server on `)
});