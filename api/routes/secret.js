const { Router } = require('express')

const router = Router()

router.get('/:hash', function (req, res, next) {
  res.send('OK')
})

router.post('/', function (req, res, next) {
  res.send('OK')
})

module.exports = router
