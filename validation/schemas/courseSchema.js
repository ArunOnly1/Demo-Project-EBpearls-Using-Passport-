const yup = require('yup')

const validationSchema = yup.object().shape({
  title: yup.string().required().min(4).max(50).trim(),
  description: yup.string().required().min(10).max(455).trim(),
  price: yup.number().positive().required().min(1),
  capacity: yup.number().positive().required().min(1),
  availability: yup.object().shape({
    from: yup.string().required().max(8).trim(),
    to: yup.string().required().max(8).trim(),
  }),
  length: yup.number().required().positive().integer(),
  category: yup.string().required().trim(),
})

module.exports = validationSchema
