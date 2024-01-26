const mongoose = require('mongoose')
const { Schema } = mongoose

const BookSchema = new Schema({
  bookId: { type: String, required: true },
  title: { type: String, required: true },
  comments: [{ type: String }],
})

const Book = mongoose.model('Book', BookSchema)

module.exports = Book
