const express = require('express')
const mongoose = require('mongoose')

const { default: config } = require('../nuxt.config.js')
const routes = require('./routes')

mongoose
  .connect(process.env.DATABASE_CONNECTION_STRING, config.mongooseOptions)
  .then(() => {
    // eslint-disable-next-line no-console
    console.info('Database connected')
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error)
  })
const app = express()

app.use(routes)

module.exports = app
