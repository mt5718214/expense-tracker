const Category = require('../category')
const categoryList = require('./category.json')
const db = require('../../config/mongoose')

db.once('open', () => {
  for (let i = 0; i < categoryList.results.length; i++) {
    const result = categoryList.results[i]
    Category.create(result)
  }

  console.log('done!')
})