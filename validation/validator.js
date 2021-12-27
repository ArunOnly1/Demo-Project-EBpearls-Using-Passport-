const { VALIDATION_FAILED, FAILED } = require('../constants/constants')

const validateRequest = (validationSchema) => async (req, res, next) => {
  try {
    const result = await validationSchema.validate(req.body)
    if (result) {
      req.body = result
    }
    next()
  } catch (error) {
    res.status(400).json({
      status: FAILED,
      message: error.message,
    })
  }
}

module.exports = validateRequest
