const express = require('express')
const mongoose = require('mongoose')
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
const record = require('./models/record')

const app = express()

mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })

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

app.get('/', (req, res) => {
  Record.find()
    .lean()
    .then(records => {
      res.render('index', { records })
    })
})

app.get('/new', (req, res) => {
  res.render('new')
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
  const { name, date, category, amount } = req.body
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

app.listen(3000, () => {
  console.log('Express is running on http://localhost:3000')
})