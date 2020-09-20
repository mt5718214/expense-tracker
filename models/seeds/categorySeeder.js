const mongoose = require('mongoose')
const Category = require('../category')
const categoryList = require('./category.json')
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/expense-tracker'

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongoose error')
})

db.once('open', () => {
  console.log('mongoose connected!')
  for (let i = 0; i < categoryList.results.length; i++) {
    const result = categoryList.results[i]
    Category.create(result)
  }

  console.log('done!')
})