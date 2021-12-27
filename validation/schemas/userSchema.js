const yup = require('yup')

const validationSchema = yup.object().shape({
  name: yup.string().required().min(3).max(55).trim().lowercase(),
  email: yup.string().email().required().trim().lowercase(),
  password: yup.string().min(6).max(20).required().trim(),
  role: yup.string().required().trim().lowercase(),
})

module.exports = validationSchema
