const bcrypt = require('bcrypt')
const debug = require('debug')('passwordValidator')
const jwt = require('jsonwebtoken')

exports.validatePassword = async (a, b) => {
  try {
    const isValid = await bcrypt.compare(a, b)
    if (isValid) {
      return true
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

exports.generatePassword = async (password) => {
  try {
    return await bcrypt.hash(password, 8)
  } catch (error) {
    debug('Cannot generate hashed password')
  }
}

exports.issueJwtAccessToken = async (payload) => {
  try {
    return await jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: 86400,
      // TODO:Ask pradeep dai why it is dont working while issuing from dev.env
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

exports.issueJwtRefreshToken = async (payload) => {
  try {
    return await jwt.sign(payload, process.env.JWT_REFRESH_KEY, {
      expiresIn: process.env.refreshTokenExpiryTime,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

exports.refreshTokenExtractor = async (requestHeader) => {
  try {
    let { refreshtoken: refreshToken } = requestHeader
    refreshToken = refreshToken.split(' ')[1]
    const payload = await jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY)
    // Deleting iat and exp from payload
    delete payload.iat
    delete payload.exp
    return { payload, refreshToken }
  } catch (error) {
    throw new Error('Cannot extract payload from refresh token')
  }
}

exports.convertTimeToSeconds = (time) => {
  const hourMinSec = time.split(':')
  const seconds =
    +hourMinSec[0] * 60 * 60 + +hourMinSec[1] * 60 + +hourMinSec[2]
  debug('seconds', seconds)

  return seconds
}

exports.convertSecondsToTime = (timeInSeconds) => {
  debug('I am here')
  // if (timeInSeconds > 86400 || timeInSeconds < 0) {
  //   throw new Error('Invalid seconds range ')
  // }
  const remainderSecondsAfterCalculatingHour = timeInSeconds % 3600
  const hour = Math.floor(timeInSeconds / 3600)
  const minute = Math.floor(remainderSecondsAfterCalculatingHour / 60)
  const second = remainderSecondsAfterCalculatingHour % 60
  debug('convertSecondstoTime', { hour, minute, second })
  return `${hour}:${minute}:${second}`
}
