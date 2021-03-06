if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const helpers = require('./_helpers')
const routes = require('./routes')
const passport = require('./config/passport')
const methodOverride = require('method-override')

const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())
app.use(methodOverride('_method'))


app.use(routes)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
