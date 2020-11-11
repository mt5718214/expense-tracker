const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const search = require('./modules/search')
const record = require('./modules/record')
const users = require('./modules/users')
const { authenticator } = require('../middleware/auth')

router.use('/users', users)
router.use('/search', authenticator, search)
router.use('/record', authenticator, record)
router.use('/', authenticator, home)

module.exports = router