const passport = require('passport')

exports.isAuth = async (req, res, next) => {
  await passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      const Err = new Error('Invalid token ')
      return res.status(401).send({ error: Err.message })
    }
    req.user = user
    next()
  })(req, res, next)
}

exports.isStudent = async (req, res, next) => {
  await passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      return res.status(401).send({ error: 'Invalid token' })
    }
    if (user.role !== 'student') {
      return res.status(401).send({ error: 'You are not a student' })
    }
    req.user = user
    next()
  })(req, res, next)
}

exports.isTeacher = async (req, res, next) => {
  await passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      return res.status(401).send({ error: 'Invalid token' })
    }
    if (user.role !== 'teacher') {
      return res.status(401).send({ error: 'You are not a teacher' })
    }
    req.user = user
    next()
  })(req, res, next)
}

exports.isLocal = async (req, res, next) => {
  await passport.authenticate(
    'local',
    { session: false },
    (err, user, info) => {
      if (err) {
        return next(err)
      }
      if (!user) {
        return res.status(401).send({ error: 'User not found' })
      }
      req.user = user
      next()
    }
  )(req, res, next)
}
