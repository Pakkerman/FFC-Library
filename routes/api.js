/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict'

require('../connection')
const Book = require('../schema')

module.exports = function (app) {
  app
    .route('/api/books')
    .get(async (req, res) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        let books = await Book.find()

        books = books.map((item) => {
          console.log(item)
          return {
            _id: item._id,
            title: item.title,
            comments: item.comments,
            commentcount: item.comments.length,
          }
        })

        return res.json(books)
      } catch (err) {
        return res.json(err)
      }
    })

    .post(async (req, res) => {
      let title = req.body.title

      // response will contain new book object including atleast _id and title
      if (!title) return res.send('missing required field title')

      try {
        let book = new Book({ title })
        book = await book.save()
        res.json(book)
      } catch (err) {
        return res.json(err)
      }
    })

    .delete(async (req, res) => {
      //if successful response will be 'complete delete successful'
    })

  app
    .route('/api/books/:id')
    .get(async (req, res) => {
      let bookid = req.params.id
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(async (req, res) => {
      let bookid = req.params.id
      let comment = req.body.comment
      console.log(bookid, comment)
    })

    .delete(async (req, res) => {
      let bookid = req.params.id
      //if successful response will be 'delete successful'
    })
}
