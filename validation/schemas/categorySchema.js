const yup = require('yup')

const validationSchema = yup.object().shape({
  name: yup.string().required().min(2).max(50).trim().lowercase(),
})

module.exports = validationSchema
