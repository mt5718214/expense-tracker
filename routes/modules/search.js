const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')
const { generateMonth } = require('../../config/monthData')

//類別與日期篩選器(filter)
router.get('/', async (req, res) => {
  const userId = req.user._id
  const { queryCategory, startDate, endDate } = req.query
  const filter = { userId, date: { $gte: `${startDate}`, $lte: `${endDate}` } }
  if (queryCategory) {
    filter.category = queryCategory
  }

  try {
    const categories = await Category.find().lean()
    const records = await Record.find(filter).lean().sort({ date: 'desc' })
    let totalAmount = 0
    records.forEach(record => {
      totalAmount += record.amount
      record.date = record.date.toISOString().slice(0, 10)
    })

    return res.render('index', { records, totalAmount, categories, startDate, endDate })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router