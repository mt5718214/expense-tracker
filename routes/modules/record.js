const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

//新增頁面
router.get('/new', (req, res) => {
  res.render('new')
})

//編輯頁面
router.get('/edit:id', async (req, res) => {
  const userId = req.user._id
  const _id = req.params.id

  try {
    const record = await Record.findOne({ _id, userId }).lean()
    record.date = record.date.toISOString().slice(0, 10)
    res.render('edit', { record })
  } catch (error) {
    console.log(error)
  }
})

//新增一筆資料
router.post('/new', async (req, res) => {
  const userId = req.user._id
  let { name, date, category, amount, merchant } = req.body
  if (!name.trim()) name = '未命名支出'
  if (!amount) amount = 0

  try {
    const categoryData = await Category.findOne({ name: category }).lean()
    const icon = categoryData.icon
    //日期為空則預設為今天
    if (!date) await Record.create({ name, category, amount, icon, merchant, userId })
    //日期不為空則依其日期設定
    else await Record.create({ name, category, date, amount, icon, merchant, userId })
  } catch (error) {
    console.log(error)
  }

  return res.redirect('/')
})

//更新一筆資料
router.put('/edit:id', async (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const { name, date, category, amount, merchant } = req.body

  try {
    const categoryData = await Category.findOne({ name: category })
    const record = await Record.findOne({ _id, userId })

    record.name = name
    record.date = date
    record.category = category
    record.amount = amount
    record.merchant = merchant
    record.icon = categoryData.icon
    await record.save()
  } catch (error) {
    console.log(error)
  }

  return res.redirect('/')
})

//刪除一筆資料
router.delete('/delete:id', async (req, res) => {
  const userId = req.user._id
  const _id = req.params.id

  try {
    const record = Record.findOne({ _id, userId })
    await record.remove()
  } catch (error) {
    console.log(error)
  }

  return res.redirect('/')
})

module.exports = router