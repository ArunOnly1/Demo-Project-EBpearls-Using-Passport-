const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const debug = require('debug')('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const User = require('../models/User')
const { validatePassword, generatePassword } = require('../lib/utils')
const customFields = {
  usernameField: 'email',
  password: 'password',
}

const verify = async (email, password, done) => {
  const user = await User.findOne({ email })
  if (!user) {
    const Err = new Error('Incorrect Email/Password')
    return done(Err)
  }
  const isValid = await validatePassword(password, user.password)
  if (!isValid) {
    const Err = new Error('Incorrect Email/Password')
    return done(Err)
  }
  const userModified = user.toObject()
  delete userModified.password
  return done(null, userModified)
}

// Local Strategy
const strategy1 = new LocalStrategy(customFields, verify)

passport.use('local', strategy1)

// JWT Strategy

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY,
  // issuer:'localhost://5000',
  // audience:''  some frontend url here
}

const strategy2 = new JwtStrategy(opts, async (payload, done) => {
  try {
    const user = await User.findOne({ _id: payload._id })
    if (!user) {
      throw new Error('Cannot find User with provided token credentials')
    }

    done(null, user)
  } catch (error) {
    done(error, false)
  }
})

passport.use('jwt', strategy2)
