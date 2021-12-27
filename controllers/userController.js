const debug = require('debug')('userController')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Auth = require('../models/Auth')

const User = require('../models/User')
const { FAILED, SUCCESS } = require('../constants/constants')
const {
  generatePassword,
  issueJwtRefreshToken,
  issueJwtAccessToken,
  refreshTokenExtractor,
  validatePassword,
} = require('../lib/utils')
const { rearg } = require('lodash')
const db_connect = require('../db/db_connect')
const Course = require('../models/Course')

exports.create = async (req, res) => {
  try {
    const newUser = new User(req.body)
    newUser.password = await generatePassword(newUser.password)
    const insertedUser = await newUser.save()
    res.status(201).send({ status: SUCCESS, user: insertedUser })
  } catch (error) {
    res.status(500).send({ status: FAILED, error: error.message })
  }
}

exports.getProfile = async (req, res) => {
  try {
    const user = req.user

    if (!user) {
      throw new Error('Cannot find the profile')
    }

    res.status(200).send({ status: SUCCESS, user })
  } catch (error) {
    res.status(500).send({ status: FAILED, message: error.message })
  }
}

exports.update = async (req, res) => {
  try {
    const oldUser = req.user
    if (!oldUser) {
      throw new Error('User with given id does not exist')
    }
    oldUser.name = req.body.name
    const updatedUser = await User.findOneAndUpdate(
      { _id: oldUser._id },
      { $set: { ...oldUser } },
      { new: true }
    )
    if (!updatedUser) {
      throw new Error('Cannot update user')
    }

    res.status(200).send({ status: SUCCESS, updatedUser })
  } catch (error) {
    res.status(500).send({ status: FAILED, error: error.message })
  }
}

exports.deleteUser = async (req, res) => {
  const conn = db_connect()
  const session = await conn.startSession()

  try {
    const { _id } = req.user

    session.startTransaction()
    await User.findByIdAndDelete(_id, { session })
    await Course.deleteMany({ owner: _id }, { session })
    await session.commitTransaction()

    res.status(200).send({ status: SUCCESS })
  } catch (error) {
    res.status(500).send({ status: FAILED, error: error.message })
    await session.abortTransaction()
  } finally {
    session.endSession()
  }
}

exports.login = async (req, res) => {
  try {
    const user = req.user
    const payload = {
      _id: user._id,
      role: user.role,
    }
    // Create jwt access token
    const token = await issueJwtAccessToken(payload)
    // Create refresh token
    const refreshToken = await issueJwtRefreshToken(payload)

    const savedRefreshToken = await new Auth({ refreshToken }).save()
    if (!savedRefreshToken) {
      throw new Error('Cannot create refrshToken')
    }
    res.setHeader('accesstoken', token)
    res.setHeader('refreshtoken', savedRefreshToken.refreshToken)

    res.status(200).send({ status: SUCCESS, user })
  } catch (error) {
    console.log(error)
    res.status(500).send({ status: FAILED, error: error.message })
  }
}

// Refresh Token
exports.tokenRegenerator = async (req, res) => {
  try {
    const { payload, refreshToken } = await refreshTokenExtractor(req.headers)

    const foundRefreshTokenInDb = await Auth.findOne({
      refreshToken,
    })
    if (!foundRefreshTokenInDb) {
      return res.sendStatus(401)
    }

    if (!payload) {
      res.status(403)
    }
    const accessToken = await issueJwtToken(payload)
    res.setHeader('accesstoken', accessToken)
    res.status(200).end()
  } catch (error) {
    res.status(500).send({ status: FAILED, error: error.message })
  }
}

// Logout User
exports.logout = async (req, res) => {
  try {
    const { refreshtoken: refreshToken } = await refreshTokenExtractor(
      req.headers
    )
    // Find the refreshToken in Auth and delete it
    await Auth.findOneAndDelete({ refreshToken })
    res.status(204).end()
  } catch (error) {
    res.status(500).send({ status: FAILED, error: error.message })
  }
}

// Changing password
exports.changePassword = async (req, res) => {
  try {
    const user = req.user
    const { newPassword, oldPassword } = req.body
    if (newPassword === oldPassword) {
      throw new Error('Old and New password are same')
    }
    const isValid = await validatePassword(oldPassword, user.password)
    if (!isValid) {
      return res
        .status(400)
        .send({ status: FAILED, message: 'Old password is incorrect' })
    }
    const hashedNewPassword = await generatePassword(newPassword)
    const updatedPassword = await User.updateOne(
      { password: user.password },
      { $set: { password: hashedNewPassword } }
    )
    if (updatedPassword.modifiedCount !== 1) {
      throw new Error('Cannot update password')
    }
    res.status(200).send({ status: SUCCESS })
  } catch (error) {
    res.status(500).send({ status: FAILED, error: error.message })
  }
}
