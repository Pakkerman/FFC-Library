/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require('chai-http')
const chai = require('chai')
const assert = chai.assert
const server = require('../server')

chai.use(chaiHttp)

let testBookId = ''
suite('Functional Tests', () => {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  // test('#example Test GET /api/books', (done) => {
  //   chai
  //     .request(server)
  //     .get('/api/books')
  //     .end((err, res) => {
  //       assert.equal(res.status, 200)
  //       assert.isArray(res.body, 'response should be an array')
  //       assert.property(
  //         res.body[0],
  //         'commentcount',
  //         'Books in array should contain commentcount'
  //       )
  //       assert.property(
  //         res.body[0],
  //         'title',
  //         'Books in array should contain title'
  //       )
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id')
  //       done()
  //     })
  // })
  /*
   * ----[END of EXAMPLE TEST]----
   */
  suite('Routing tests', () => {
    suite(
      'POST /api/books with title => create book object/expect book object',
      () => {
        test('Test POST /api/books with title', (done) => {
          const input = { title: 'test' }

          chai
            .request(server)
            .post('/api/books')
            .send(input)
            .end((err, res) => {
              assert.equal(res.status, 200)
              assert.property(res.body, '_id')
              assert.property(res.body, 'title')
              assert.property(res.body, 'comments')
              testBookId = res.body._id
              done()
            })
        })

        test('Test POST /api/books with no title given', (done) => {
          const input = {}
          const expected = 'missing required field title'

          chai
            .request(server)
            .post('/api/books')
            .send(input)
            .end((err, res) => {
              assert.equal(res.status, 200)
              assert.equal(res.text, expected)
              done()
            })
        })
      }
    )

    suite('GET /api/books => array of books', () => {
      test('Test GET /api/books', (done) => {
        chai
          .request(server)
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.isArray(res.body)
            if (1 >= res.body.length) {
              const item = res.body[0]
              assert.property(item, '_id')
              assert.property(item, 'title')
              assert.property(item, 'comments')
              assert.property(item, 'commentcount')
            }
            done()
          })
      })
    })

    suite('GET /api/books/[id] => book object with [id]', () => {
      test('Test GET /api/books/[id] with id not in db', (done) => {
        const id = '000'
        const expected = 'no book exists'

        chai
          .request(server)
          .get(`/api/books/${id}`)
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.text, expected)
            done()
          })
      })

      test('Test GET /api/books/[id] with valid id in db', (done) => {
        const id = testBookId
        const expected = {
          _id: id,
          title: 'test',
          comments: [],
          commentcount: 0,
        }

        chai
          .request(server)
          .get(`/api/books/${id}`)
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.deepEqual(res.body, expected)
          })

        done()
      })
    })

    suite(
      'POST /api/books/[id] => add comment/expect book object with id',
      () => {
        test('Test POST /api/books/[id] with comment', (done) => {
          const input = { _id: testBookId, comment: 'test comment' }
          const expected = {
            _id: testBookId,
            comments: ['test comment'],
            commentcount: 1,
            title: 'test',
          }

          chai
            .request(server)
            .post(`/api/books/${testBookId}`)
            .send(input)
            .end((err, res) => {
              assert.equal(res.status, 200)
              assert.deepEqual(res.body, expected)
              done()
            })
        })

        test('Test POST /api/books/[id] without comment field', (done) => {
          const input = { _id: testBookId }
          const expected = 'missing required field comment'
          chai
            .request(server)
            .post(`/api/books/${testBookId}`)
            .send(input)
            .end((err, res) => {
              assert.equal(res.status, 200)
              assert.equal(res.text, expected)
              done()
            })
        })

        test('Test POST /api/books/[id] with comment, id not in db', (done) => {
          const input = { _id: 'idNotInDB', comment: 'test comment' }
          const expected = 'no book exists'
          chai
            .request(server)
            .post(`/api/books/idNotInDB`)
            .send(input)
            .end((err, res) => {
              assert.equal(res.status, 200)
              assert.equal(res.text, expected)
              done()
            })
        })
      }
    )

    suite('DELETE /api/books/[id] => delete book object id', () => {
      test('Test DELETE /api/books/[id] with valid id in db', (done) => {
        const id = testBookId
        const expected = 'delete successful'

        chai
          .request(server)
          .delete(`/api/books/${id}`)
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.text, expected)
            done()
          })
      })

      test('Test DELETE /api/books/[id] with  id not in db', (done) => {
        const id = 'invalid id'
        const expected = 'no book exists'

        chai
          .request(server)
          .delete(`/api/books/${id}`)
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.text, expected)
            done()
          })
      })
    })
  })
})
