const express = require('express')
const PORT = process.env.PORT || 3000
const routes = require('./routes')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const session = require('express-session')
const usePassport = require('./config/passport')
const methodOverride = require('method-override')
/**
 * 在後面加上()=> returns object with all (130+) helpers
 * 只拿出 helpers 分類中的 comparison 物件
 * 也可另外寫成 const comparison = helpers.comparison()
 * 若要其他物件可在陣列中繼續添加 EX : (['a', 'b', 'c'])
 */
const helpers = require('handlebars-helpers')(['comparison'])

require('./config/mongoose')
const app = express()

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(session({
  secret: 'ThisIsMySessionSecret',
  resave: false,
  saveUninitialized: true
}))
usePassport(app)
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  next()
})
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(routes)

app.listen(PORT, () => {
  console.log('Express is running on http://localhost:3000')
})