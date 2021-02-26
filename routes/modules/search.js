const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')
const { generateMonth } = require('../../config/monthData')

//類別與日期篩選器(filter)
router.get('/', async (req, res) => {
  const userId = req.user._id
  const { queryCategory, startDate, endDate, keyword } = req.query
  const filter = { userId, date: { $gte: `${startDate}`, $lte: `${endDate}` } }
  if (queryCategory) {
    filter.category = queryCategory
  }

  try {
    const categories = await Category.find().lean()
    let records = await Record.find(filter).lean().sort({ date: 'desc' })

    //計算總金額與將date格式轉換為字串
    let totalAmount = 0
    records.forEach(record => {
      totalAmount += record.amount
      record.date = record.date.toISOString().slice(0, 10)
    })

    //篩選符合keyword的資料
    records = records.filter(record => record.name.toLowerCase().includes(keyword.trim().toLowerCase()))

    return res.render('index', { records, totalAmount, categories, startDate, endDate })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router