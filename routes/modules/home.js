const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')
const moment = require('moment')

//首頁
router.get('/', async (req, res) => {
  const userId = req.user._id
  const endDate = moment().format('YYYY-MM-DD')
  const startDate = moment().format('YYYY-01-01')

  try {
    const records = await Record.find({ userId }).lean().sort({ date: 'desc' })
    const categories = await Category.find().lean()
    const categoryArray = []
    let totalAmount = 0

    records.forEach(record => {
      totalAmount += record.amount
      record.date = record.date.toISOString().slice(0, 10)
    })
    categories.forEach(category => categoryArray.push(category.name))

    return res.render('index', { records, totalAmount, categoryArray, startDate, endDate })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router