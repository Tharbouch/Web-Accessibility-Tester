const cors = require('cors')
const express = require('express')
const http = require('http')
const dovenv = require('dotenv').config()
const { v4: uuidv4 } = require('uuid');
const helmet = require('helmet')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const { errHandler } = require('./Middlewares/errMiddleware')
const accessibilityCheckRoutes = require('./Routes/testingRoute')
const generate = require('./Routes/auth')
const UserRoutes = require('./Routes/user')
const connectDb = require('./Helpers/connectDB')


const app = express()
connectDb()

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors({ origin: 'http://localhost:5173', methods: ["GET", "POST", "PUT", "DELETE"], credentials: true }))
app.use(
    session({
        secret: 'ButtercupMadd3007',
        genid: () => uuidv4(),
        cookie: {
            httpOnly: true,
            secure: true,
        },
        saveUninitialized: true,
        resave: false,
    })
);
app.use(cookieParser())
app.disable('x-powered-by');

//Routes
app.use('/api/v1/generate', generate)
app.use('/api/v1/', accessibilityCheckRoutes)
app.use('/api/v1/user', UserRoutes)

//err middleware

app.use(errHandler)

//server run

const server = http.createServer(app)
server.listen(process.env.PORT || 4000, () => {
    console.log(`server on `)
});