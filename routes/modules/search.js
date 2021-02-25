const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')
const { generateMonth } = require('../../config/monthData')

//類別與日期篩選器(filter)
router.get('/', async (req, res) => {
  const userId = req.user._id
  const category = req.query.category
  const startDate = req.query.startDate
  const endDate = req.query.endDate
  const filter = { userId, date: { $gte: `${startDate}`, $lte: `${endDate}` } }
  if (category) {
    filter.category = category
  }

  try {
    const records = await Record.find(filter).lean().sort({ date: 'desc' })
    const categories = await Category.find().lean()
    const categoryArray = []
    let totalAmount = 0

    records.forEach(record => {
      totalAmount += record.amount
      record.date = record.date.toISOString().slice(0, 10)
    })
    categories.forEach(category => categoryArray.push(category.name))

    return res.render('index', { records, totalAmount, categoryArray, category, startDate, endDate })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router