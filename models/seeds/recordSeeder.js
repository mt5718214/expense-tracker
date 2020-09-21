const Record = require('../record')
const recordList = require('./record.json')
const db = require('../../config/mongoose')

db.once('open', () => {
  for (let i = 0; i < recordList.results.length; i++) {
    const result = recordList.results[i]
    Record.create(result)
  }

  console.log('done!')
})