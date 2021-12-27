const express = require('express')
const validateRequest = require('../validation/validator')
const validationSchema = require('../validation/schemas/categorySchema')
const {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  getCategories,
} = require('../controllers/categoryController')
const { isAuth, isTeacher } = require('../middlewares/auth')

const router = express.Router()

// Create category
router.post('/', isTeacher, validateRequest(validationSchema), createCategory)

// Get single category
router.get('/:id', isAuth, getCategory)

// Get all categories
router.get('/', isAuth, getCategories)

// Update category
router.patch('/:id', isAuth, validateRequest(validationSchema), updateCategory)

// Delete Category
router.delete('/:id', isAuth, deleteCategory)

module.exports = router
