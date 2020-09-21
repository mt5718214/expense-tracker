const express = require('express')
const mongoose = require('mongoose')
const routes = require('./routes')
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

const app = express()
const PORT = process.env.PORT || 3000

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
app.use(routes)

app.listen(PORT, () => {
  console.log('Express is running on http://localhost:3000')
})