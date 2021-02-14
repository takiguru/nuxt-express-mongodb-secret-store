const crypto = require('crypto')

const generateIv = () => {
  return crypto.randomBytes(16).toString('hex')
}

const generateHash = (text) => {
  return crypto.createHash('sha256').update(text).digest('hex')
}

const encryptText = (text, key, iv) => {
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(key, 'hex'),
    Buffer.from(iv, 'hex')
  )
  return cipher.update(text, 'utf8', 'base64') + cipher.final('base64')
}

const decryptText = (text, key, iv) => {
  const cipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(key, 'hex'),
    Buffer.from(iv, 'hex')
  )
  return cipher.update(text, 'base64', 'utf8') + cipher.final('utf8')
}

module.exports = {
  generateIv,
  generateHash,
  encryptText,
  decryptText,
}
