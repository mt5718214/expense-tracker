const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const search = require('./modules/search')
const record = require('./modules/record')
const users = require('./modules/users')

router.use('/users', users)
router.use('/search', search)
router.use('/record', record)
router.use('/', home)

module.exports = router