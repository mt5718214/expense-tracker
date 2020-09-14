const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('This is Express app')
})


app.listen(3000, () => {
  console.log('Express is running on http://localhost:3000')
})