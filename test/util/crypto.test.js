const cryptoUtil = require('../../api/util/crypto')

describe('util/crypto', () => {
  test('generateHash creates SHA256 hash', () => {
    const hash = cryptoUtil.generateHash('testhash')
    expect(hash).toEqual(
      '4bc75035d73f6083683e040fc31f28e0ec6d1cbce5cb0a5e2611eb89bceb6c16'
    )
  })

  test('encrypt text and decrypted text is equal', () => {
    const text = 'Encrypt me please'
    const iv = cryptoUtil.generateIv()
    const hash = cryptoUtil.generateHash(text)
    const encryptedText = cryptoUtil.encryptText(text, hash, iv)
    expect(cryptoUtil.decryptText(encryptedText, hash, iv))
  })
})
