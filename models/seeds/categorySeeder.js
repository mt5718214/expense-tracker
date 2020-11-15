if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Category = require('../category')
const categoryList = require('./category.json')
const db = require('../../config/mongoose')

db.once('open', () => {
  const length = categoryList.results.length
  return Promise.all(Array.from({ length }, (_, i) => {
    const result = categoryList.results[i]
    return Category.create(result)
  }))
    .then(() => {
      console.log('done')
      process.exit()
    })
})