const request = require('supertest')
const { MongoMemoryServer } = require('mongodb-memory-server')
const dayjs = require('dayjs')

const cryptoUtil = require('../../api/util/crypto')
const mongod = new MongoMemoryServer()
const testText = 'psssh this is secret'
const testHash = cryptoUtil.generateHash(testText)

describe('/secret', () => {
  let app
  let remainingViews = 1
  beforeAll(async () => {
    const mongodbUri = await mongod.getUri()
    process.env.DATABASE_CONNECTION_STRING = mongodbUri // I know kill it with fire later
    app = require('../../api')
  })

  afterAll(async () => {
    app.close()
    await mongod.stop()
  })

  test('create simple secret', async () => {
    const response = await request(app).post('/secret').send({
      secret: testText,
    })
    expect(response.statusCode).toBe(200)
    expect(response.body.secretText).toEqual(testText)
    expect(response.body.hash).toEqual(testHash)
  })

  test('create secret with remainingViews', async () => {
    const response = await request(app).post('/secret').send({
      secret: testText,
      expireAfterViews: remainingViews,
    })
    expect(response.statusCode).toBe(200)
    expect(response.body.secretText).toEqual(testText)
    expect(response.body.hash).toEqual(testHash)
    expect(response.body.remainingViews).toEqual(remainingViews)
  })

  test('decrease remainingViews until expire', async () => {
    // Decrease it to 0
    remainingViews--
    let response = await request(app).get(`/secret/${testHash}`)
    expect(response.statusCode).toBe(200)
    expect(response.body.secretText).toEqual(testText)
    expect(response.body.hash).toEqual(testHash)
    expect(response.body.remainingViews).toEqual(remainingViews)
    response = await request(app).get(`/secret/${testHash}`)
    expect(response.statusCode).toBe(400)
  })

  test('create secret with past expirationTIme', async () => {
    let response = await request(app)
      .post('/secret')
      .send({
        secret: testText,
        expireAfter: dayjs().subtract(1, 'day'),
      })
    expect(response.statusCode).toBe(200)
    response = await request(app).get(`/secret/${testHash}`)
    expect(response.statusCode).toBe(400)
  })

  test('create secret with future expirationTIme', async () => {
    let response = await request(app)
      .post('/secret')
      .send({
        secret: testText,
        expireAfter: dayjs().add(1, 'day'),
      })
    expect(response.statusCode).toBe(200)
    response = await request(app).get(`/secret/${testHash}`)
    expect(response.statusCode).toBe(200)
  })
})
