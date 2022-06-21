const express = require('express')
const dotenv = require('dotenv').config()
const port = process.env.PORT || 5000
const session = require('express-session')
const passport = require('passport')
const connectDB = require('./config/db')
const {errorHandler} = require("./middleware/errorMiddleware")

// Passport config
require('./config/passport')(passport)

app = express()

connectDB()

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.disable('x-powered-by')

// Sessions
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.use("/users",require('./routers/userRoutes'))
app.use("/projects",require('./routers/projectRoutes'))
app.use("/notes",require('./routers/noteRoutes'))

app.get("/", (req,res) => {
    if (!req.user) {
        res.status(200).send("Hello dear! <a href='/users/google'> Login with Google</a>")
    }else{
        res.status(200).send(req.user)
    }
})

app.get("/failed", (req,res) => {
    res.status(200).send("Failed! <a href='/users/google'> Login with Google</a>")
})

app.use(errorHandler)

app.listen(port,() =>{
    console.log(`server is running on port ${port}`);
})

