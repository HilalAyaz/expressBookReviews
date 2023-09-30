const express = require('express')
let books = require('./booksdb.js')
let isValid = require('./auth_users.js').isValid
let users = require('./auth_users.js').users
const public_users = express.Router()

public_users.post('/register', (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required' })
  }
  if (users.some(user => user.username === username)) {
    return res.status(409).json({ message: 'Username already exists' })
  }
  return res.status(201).json({ message: 'User registered successfully' })
})

public_users.get('/', function (req, res) {
  const bookList = Object.values(books)
  return res.status(200).json({ books: bookList })
})

public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn
  if (books[isbn]) {
    return res.status(200).json({ book: books[isbn] })
  } else {
    return res.status(404).json({ message: 'Book not found' })
  }
})

public_users.get('/author/:author', function (req, res) {
  const author = req.params.author
  const matchingBooks = Object.values(books).filter(
    book => book.author === author
  )
  return res.status(200).json({ books: matchingBooks })
})

public_users.get('/title/:title', function (req, res) {
  const title = req.params.title
  const matchingBooks = Object.values(books).filter(
    book => book.title === title
  )
  return res.status(200).json({ books: matchingBooks })
})

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn
  if (books[isbn] && books[isbn].reviews) {
    return res.status(200).json({ reviews: books[isbn].reviews })
  } else {
    return res.status(404).json({ message: 'Reviews not found for this book' })
  }
})

module.exports.general = public_users
