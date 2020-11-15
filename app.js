const express = require('express')
const routes = require('./routes')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')
const usePassport = require('./config/passport')
const methodOverride = require('method-override')
/**
 * 在後面加上()=> returns object with all (130+) helpers
 * 只拿出 helpers 分類中的 comparison 物件
 * 也可另外寫成 const comparison = helpers.comparison()
 * 若要其他物件可在陣列中繼續添加 EX : (['a', 'b', 'c'])
 */
const helpers = require('handlebars-helpers')(['comparison'])

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

require('./config/mongoose')
const app = express()
const PORT = process.env.PORT

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
usePassport(app)
app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.error = req.flash('error')
  next()
})
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(routes)

app.listen(PORT, () => {
  console.log(`Express is running on http://localhost:${PORT}`)
})