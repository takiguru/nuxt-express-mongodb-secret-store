const mongoose = require('mongoose')
const cryptoUtil = require('../util/crypto')

const secretSchema = new mongoose.Schema(
  {
    iv: {
      type: String,
      required: true,
    },
    hash: {
      type: String,
      required: true,
      unique: true,
    },
    secretText: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
    expiresAt: {
      type: Date,
    },
    remainingViews: {
      type: Number,
    },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        delete ret._id
        delete ret.iv
        delete ret.__v
        ret.secretText = cryptoUtil.decryptText(
          ret.secretText,
          ret.hash,
          doc.iv
        )
      },
    },
  }
)

module.exports = mongoose.model('Secret', secretSchema)
