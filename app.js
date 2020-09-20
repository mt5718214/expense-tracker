const express = require('express')
const mongoose = require('mongoose')
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/expense-tracker'
const exphbs = require('express-handlebars')
/**
 * 在後面加上()=> returns object with all (130+) helpers
 * 只拿出 helpers 分類中的 comparison 物件
 * 也可另外寫成 const comparison = helpers.comparison()
 * 若要其他物件可在陣列中繼續添加 EX : (['a', 'b', 'c'])
 */
const helpers = require('handlebars-helpers')(['comparison'])
const bodyParser = require('body-parser')
const Record = require('./models/record')
const Category = require('./models/category')

const app = express()

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongoose error')
})

db.once('open', () => {
  console.log('mongoose connected!')
})

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get('/', (req, res) => {
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

app.get('/new', (req, res) => {
  res.render('new')
})

app.get('/search', (req, res) => {
  const category = req.query.filter
  Record.find({ category })
    .lean()
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

app.get('/edit:id', (req, res) => {
  const id = req.params.id
  Record.findById(id)
    .lean()
    .then(record => {
      res.render('edit', { record })
    })
})

app.post('/new', (req, res) => {
  let { name, date, category, amount } = req.body
  if (!name.trim()) name = '未命名支出'
  if (!amount) amount = 0
  if (!date) {
    const dateObj = new Date()
    const year = dateObj.getFullYear()
    const month = dateObj.getMonth() + 1
    const day = dateObj.getDate()
    date = `${year}-${month}-${day}`
  }

  Category.findOne({ name: category })
    .lean()
    .then(categoryData => {
      const icon = categoryData.icon
      Record.create({ name, category, date, amount, icon })
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.post('/edit:id', (req, res) => {
  const id = req.params.id
  const { name, date, category, amount } = req.body
  Category.findOne({ name: category })
    .then(categoryData => {
      const icon = categoryData.icon
      Record.findById(id)
        .then(record => {
          record.name = name
          record.date = date
          record.category = category
          record.amount = amount
          record.icon = icon
          return record.save()
        })
        .catch(error => console.log(error))
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.post('/delete:id', (req, res) => {
  const id = req.params.id
  Record.findById(id)
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.listen(3000, () => {
  console.log('Express is running on http://localhost:3000')
})