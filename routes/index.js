const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const search = require('./modules/search')
const record = require('./modules/record')

router.use('/', home)
router.use('/search', search)
router.use('/record', record)


module.exports = router