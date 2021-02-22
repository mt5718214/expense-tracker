const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')
const { generateMonth } = require('../../config/monthData')

//類別與月份篩選器(filter)
router.get('/', async (req, res) => {
  const userId = req.user._id
  const category = req.query.category
  const month = req.query.month
  const today = new Date()
  const year = today.getFullYear()
  const filter = { userId }

  if (category) {
    filter.category = category
  }

  if (month) {
    filter.date = { $gte: `${year}-${month}-1`, $lte: `${year}-${month}-31` }
  }

  try {
    const records = await Record.find(filter).lean().sort({ date: 'desc' })
    const categories = await Category.find().lean()
    const months = generateMonth()
    const categoryArray = []
    let totalAmount = 0

    records.forEach(record => {
      totalAmount += record.amount
      record.date = record.date.toISOString().slice(0, 10)
    })
    categories.forEach(category => categoryArray.push(category.name))

    return res.render('index', { records, totalAmount, categoryArray, months, category, month })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router