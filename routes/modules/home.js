const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/', (req, res) => {
  Record.find()
    .lean()
    .sort({ date: 'desc' })
    .then(records => {
      let totalAmount = 0
      records.forEach(record => totalAmount += record.amount)

      Category.find()
        .lean()
        .then(categories => {
          let categoryArray = []
          categories.forEach(category => categoryArray.push(category.name))
          return res.render('index', { records, totalAmount, categoryArray })
        })
        .catch(error => console.log(error))
    })
})

module.exports = router