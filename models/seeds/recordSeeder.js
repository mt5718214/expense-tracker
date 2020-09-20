const mongoose = require('mongoose')
const Record = require('../record')
const recordList = require('./record.json')
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/expense-tracker'

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongoose error')
})

db.once('open', () => {
  console.log('mongoose connected!')

  for (let i = 0; i < recordList.results.length; i++) {
    const result = recordList.results[i]
    Record.create(result)
  }

  console.log('done!')
})