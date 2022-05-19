const express = require('express')
const cors = require("cors")
const app = express()

// Load environment variables
require("dotenv").config()

// Configure express app
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Add app listening port
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`)
})

// Add CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "PUT", "POST", "PATCH", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept'],
  credentials: true, //Credentials are cookies, authorization headers or TLS client certificates.
}))

// include before other routes
app.options('*', cors())

app.use(require('./routes'))