const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')
const { generateMonth } = require('../../config/monthData')

router.get('/', (req, res) => {
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

  Record.find(filter)
    .lean()
    .then(records => {
      let totalAmount = 0
      records.forEach(record => {
        totalAmount += record.amount
        record.date = record.date.toISOString().slice(0, 10)
      })

      Category.find()
        .lean()
        .then(categories => {
          const months = generateMonth()
          const categoryArray = []
          categories.forEach(category => categoryArray.push(category.name))
          return res.render('index', { records, totalAmount, categoryArray, months, category, month })
        })
        .catch(error => console.log(error))
    })

})

module.exports = router