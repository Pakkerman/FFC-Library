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
        let result = await Book.find()

        const out = result.map((item) => {
          return {
            _id: item._id,
            title: item.title,
            comments: item.comments,
            commentcount: item.comments.length,
          }
        })

        return res.json(out)
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
      try {
        await Book.deleteMany({})
        return res.send('complete delete successful')
      } catch (err) {
        res.send('delete fail')
      }
    })

  app
    .route('/api/books/:id')
    .get(async (req, res) => {
      console.log('GET /api/books/:id')
      let bookid = req.params.id
      console.log('_id', bookid)
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

      try {
        const result = await Book.findById({ _id: bookid })
        const out = {
          _id: result._id,
          title: result.title,
          comments: result.comments,
          commentcount: result.comments.length,
        }

        return res.json(out)
      } catch (err) {
        console.log('catch!')
        res.send('no book exists')
        // return res.json(err)
      }
    })

    .post(async (req, res) => {
      let bookid = req.params.id
      let comment = req.body.comment

      if (!bookid) return res.send('missing required field title')
      if (!comment) return res.send('missing required field comment')

      try {
        const result = await Book.findOneAndUpdate(
          { _id: bookid },
          { $push: { comments: comment } },
          { new: true }
        )

        const out = {
          _id: result._id,
          title: result.title,
          comments: result.comments,
          commentcount: result.comments.length,
        }

        return res.json(out)
      } catch {
        // if no book
        return res.send('no book exists')
      }
    })

    .delete(async (req, res) => {
      let bookid = req.params.id
      //if successful response will be 'delete successful'
      try {
        const result = await Book.findOneAndDelete({ _id: bookid })
        if (!result) return res.send('no book exists')
        return res.send('delete successful')
      } catch (err) {}
    })
}
