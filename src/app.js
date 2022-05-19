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
  origin: ["*", "localhost:3000"],
  methods: ["GET", "PUT", "POST", "PATCH", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept'],
  credentials: true,
}))

app.use(require('./routes'))