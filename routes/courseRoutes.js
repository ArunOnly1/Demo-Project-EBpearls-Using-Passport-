const express = require('express')
const passport = require('passport')
const debug = require('debug')('courseRoute')

const validateRequest = require('../validation/validator')
const validationSchema = require('../validation/schemas/courseSchema')

const {
  createCourse,
  updateCourse,
  deleteCourse,
  getSingleCourse,
  getCourses,
  filterByCategory,
  getAllCourses,
  enrollRequest,
  enrollDecide,
  getEnrolledCourses,
} = require('../controllers/courseController')
const { isAuth, isTeacher, isStudent } = require('../middlewares/auth')

const router = express.Router()

// @ /api/courses

// Create course
router.post('/', isTeacher, validateRequest(validationSchema), createCourse)

// Update course
router.patch('/:id', isTeacher, validateRequest(validationSchema), updateCourse)

// Delete Course
router.delete('/:id', isTeacher, deleteCourse)

// Get single course
//* fetch is added in route to resolve conflict with /category route
router.get('/fetch/:id', isAuth, getSingleCourse)
// Get all courses  regardless of role
router.get('/all', isAuth, getAllCourses)

// Get courses based on query
// limit, skip,sortBy
// Get courses created by self(teacher)
router.get('/me', isTeacher, getCourses)

// Get enrolled Courses by Student
router.get('/student/me', isStudent, getEnrolledCourses)
// Filter
// By Category
router.get('/category', isAuth, filterByCategory)

// students into enroll pending phase
router.post('/enroll_req/:id', isStudent, enrollRequest)

// students into enroll approved phase
// studentId and CourseId and status:"accepted or rejected" is supplied from req body
// Pending status can be approved or rejected
// !But once rejected cannot be approved again and vice versa
router.post('/enroll_decide/', isTeacher, enrollDecide)

module.exports = router
