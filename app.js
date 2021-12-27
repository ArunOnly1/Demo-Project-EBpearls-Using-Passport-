const express = require('express')
const passport = require('passport')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const debug = require('debug')('app')

const db_connect = require('./db/db_connect')
const userRouter = require('./routes/userRoutes')
const courseRouter = require('./routes/courseRoutes')
const categoryRouter = require('./routes/categoryRoutes')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

db_connect()

app.use((req, res, next) => {
  if (process.env.MODE === 'maintenance') {
    return res.status(503).send({
      message: 'This site is under maintenance.Please come back soon',
    })
  }
  next()
})
// TODO: Implement cors policy

// app.use(
//   session({
//     secret: 'stjdjkajdfka',
//     resave: false,
//     saveUninitialized: true,
//   })
// )

//Initializing passport
require('./middlewares/passport')
app.use(passport.initialize())
// app.use(passport.session())

app.use('/api/users', userRouter)
app.use('/api/courses', courseRouter)
app.use('/api/category', categoryRouter)

app.use((err, req, res, next) => {
  debug(err.stack)
  res.status(err.status || 500)
  res.send({ error: err.message })
})
module.exports = app
