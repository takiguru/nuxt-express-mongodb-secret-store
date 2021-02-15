const { Router } = require('express')
const dayjs = require('dayjs')

const cryptoUtil = require('../util/crypto')
const SecretModel = require('../models/secret')
const router = Router()

router.get('/:hash', async function (req, res, next) {
  const secret = await SecretModel.findOne({ hash: req.params.hash })

  if (!secret) {
    res.status(404).json({ message: 'Secret not found' })
    return
  }

  if (secret.expiresAt) {
    const expireDate = dayjs(secret.expiresAt)
    if (dayjs().isAfter(expireDate)) {
      res.status(400).json({ message: 'Secret expired' })
      return
    }
  }

  if (Number.isInteger(secret.remainingViews)) {
    if (secret.remainingViews === 0) {
      res.status(400).json({ message: 'Secret run out of remaining views' })
      return
    }
    secret.remainingViews--
    await secret.save()
  }

  res.status(200).send(secret.toJSON())
})

router.post('/', async function (req, res, next) {
  const secretHash = cryptoUtil.generateHash(req.body.secret)
  const iv = cryptoUtil.generateIv()
  const encryptedText = cryptoUtil.encryptText(req.body.secret, secretHash, iv)

  // Remove if exists (you can't response it's already exists and the task was not clear about that "[The hash of the string]" )
  await SecretModel.deleteMany({ hash: secretHash })

  const secret = new SecretModel({
    iv,
    hash: secretHash,
    secretText: encryptedText,
    expiresAt: req.body.expireAfter
      ? dayjs(req.body.expireAfter).toDate()
      : undefined,
    remainingViews: req.body.expireAfterViews,
  })

  await secret.save()

  res.status(200).send(secret.toJSON())
})

module.exports = router
