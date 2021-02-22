const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')
const { generateMonth } = require('../../config/monthData')

//首頁
router.get('/', async (req, res) => {
  const userId = req.user._id

  try {
    const records = await Record.find({ userId }).lean().sort({ date: 'desc' })
    const categories = await Category.find().lean()
    const months = generateMonth()
    const categoryArray = []
    let totalAmount = 0

    records.forEach(record => {
      totalAmount += record.amount
      record.date = record.date.toISOString().slice(0, 10)
    })
    categories.forEach(category => categoryArray.push(category.name))

    return res.render('index', { records, totalAmount, categoryArray, months })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router