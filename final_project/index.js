const express = require('express')
const jwt = require('jsonwebtoken')
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated
const genl_routes = require('./router/general.js').general

const app = express()

app.use(express.json())

app.use(
  '/customer',
  session({
    secret: 'fingerprint_customer',
    resave: true,
    saveUninitialized: true
  })
)

app.use('/customer/auth/*', function auth (req, res) {
  // Check if the user has a valid JWT token in their session
  const token = req.session.token

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - Please log in' })
  }

  try {
    // Verify the JWT token with your secret key
    const decoded = jwt.verify(token, 'mynameishilalayaz')
    // You can access the decoded data, such as the username, here
    req.session.username = decoded.username // Store the username in the session for future use
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized - Invalid token' })
  }
})

const PORT = 5000

app.use('/customer', customer_routes)
app.use('/', genl_routes)

app.listen(PORT, () => console.log('Server is running on port 5000'))
