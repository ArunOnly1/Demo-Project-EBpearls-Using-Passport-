const yup = require('yup')

const validationSchema = yup.object().shape({
  name: yup.string().required().min(3).max(55).trim().lowercase(),
})

module.exports = validationSchema
