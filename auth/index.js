const router = require('express').Router()
module.exports = router

router.use('/facebook', require('./facebook'))
