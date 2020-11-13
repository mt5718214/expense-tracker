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
      record.date = record.date.toISOString().slice(0, 10)
      res.render('edit', { record })
    })
})

//新增資料
router.post('/new', (req, res) => {
  const userId = req.user._id
  let { name, date, category, amount, merchant } = req.body
  if (!name.trim()) name = '未命名支出'
  if (!amount) amount = 0

  Category.findOne({ name: category })
    .lean()
    .then(categoryData => {
      const icon = categoryData.icon
      //日期為空則預設為今天
      if (!date) return Record.create({ name, category, amount, icon, merchant, userId })
      //日期不為空則依其日期設定
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