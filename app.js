const express = require('express')
const mongoose = require('mongoose')

const app = express()

mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongoose error')
})

db.once('open', () => {
  console.log('mongoose connected!')
})

app.get('/', (req, res) => {
  res.send('This is Express app')
})


app.listen(3000, () => {
  console.log('Express is running on http://localhost:3000')
})