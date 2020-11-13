const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')
const { generateMonth } = require('../../config/monthData')

router.get('/', (req, res) => {
  const userId = req.user._id
  Record.find({ userId })
    .lean()
    .sort({ date: 'desc' })
    .then(records => {
      const months = generateMonth()
      let totalAmount = 0
      records.forEach(record => {
        totalAmount += record.amount
        record.date = record.date.toISOString().slice(0, 10)
      })

      Category.find()
        .lean()
        .then(categories => {
          let categoryArray = []
          categories.forEach(category => categoryArray.push(category.name))
          return res.render('index', { records, totalAmount, categoryArray, months })
        })
        .catch(error => console.log(error))
    })
})

module.exports = router