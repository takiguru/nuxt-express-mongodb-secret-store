const { Router } = require('express')

const secretRouter = require('./secret')

const router = Router()
router.use('/secret', secretRouter)

module.exports = router
