const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

//新增頁面
router.get('/new', (req, res) => {
  res.render('new')
})

//編輯頁面
router.get('/edit:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  Record.findOne({ _id, userId })
    .lean()
    .then(record => {
      res.render('edit', { record })
    })
})

//新增資料
router.post('/new', (req, res) => {
  const userId = req.user._id
  let { name, date, category, amount, merchant } = req.body
  if (!name.trim()) name = '未命名支出'
  if (!amount) amount = 0
  if (!date) {
    const dateObj = new Date()
    const year = dateObj.getFullYear()
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
    const day = dateObj.getDate()
    date = `${year}-${month}-${day}`
  }

  Category.findOne({ name: category })
    .lean()
    .then(categoryData => {
      const icon = categoryData.icon
      Record.create({ name, category, date, amount, icon, merchant, userId })
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//編輯資料
router.put('/edit:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const { name, date, category, amount, merchant } = req.body
  Category.findOne({ name: category })
    .then(categoryData => {
      const icon = categoryData.icon
      Record.findOne({ _id, userId })
        .then(record => {
          record.name = name
          record.date = date
          record.category = category
          record.amount = amount
          record.merchant = merchant
          record.icon = icon
          return record.save()
        })
        .catch(error => console.log(error))
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//刪除資料
router.delete('/delete:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  Record.findOne({ _id, userId })
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router