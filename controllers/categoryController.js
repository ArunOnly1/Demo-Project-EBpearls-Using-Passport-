const StatusCodes = require('http-status-codes')

const { SUCCESS, FAILED } = require('../constants/constants')
const Category = require('../models/Category')
const { respondSuccess, respondError } = require('../helpers/responseHelper')

exports.createCategory = async (req, res) => {
  try {
    const newCategory = new Category(req.body)
    const insertedCategory = await newCategory.save()
    if (!insertedCategory) {
      throw new Error('Cannot create category')
    }
    // res.status(201).send({ status: SUCCESS, category: insertedCategory })
    return respondSuccess(
      res,
      StatusCodes.CREATED,
      'Successfully created',
      'Done gracefully',
      insertedCategory
    )
  } catch (error) {
    res.status(500).send({ status: FAILED, error: error.message })
  }
}

exports.getCategory = async (req, res) => {
  try {
    const { id } = req.params
    const category = await Category.findById(id)
    if (!category) {
      throw new Error('Cannot find the category')
    }
    res.status(200).send({ status: SUCCESS, category })
  } catch (error) {
    res.status(500).send({ status: FAILED, error: error.message })
  }
}

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
    res.status(200).send({ status: SUCCESS, categories })
  } catch (error) {
    res.status(500).send({ status: FAILED, error: error.message })
  }
}

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params
    const updatedCategory = await Category.findOneAndUpdate(
      { _id: id },
      { $set: { ...req.body } },
      { new: true }
    )
    if (!updatedCategory) {
      throw new Error('Cannot update the category')
    }
    res.status(200).send({ status: SUCCESS, updatedCategory })
  } catch (error) {
    res.status(500).send({ status: FAILED, error: error.message })
  }
}

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params
    const deletedCategory = await Category.findByIdAndDelete(id)
    res.status(200).send({ status: SUCCESS, deletedCategory })
  } catch (error) {
    res.status(500).send({ status: FAILED, error: error.message })
  }
}
