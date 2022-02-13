const { nanoid } = require('nanoid')
const books = require('./books')
const responseObj = require('./response')
const {
  getUnfilteredBooks,
  getFilteredBooksReading,
  getFilteredBooksFinished,
  getFilteredBooksNamed
} = require('./books-data')

const addBookHandler = (req, h) => {
  const id = nanoid(16)
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = req.payload
  const finished = pageCount === readPage
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  if (name === '' || name === undefined) {
    return h.response(responseObj({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })).code(400)
  } else if (readPage > pageCount) {
    return h.response(responseObj({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })).code(400)
  }
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt
  }
  books.push(newBook)
  const isSuccess = books.filter((book) => book.id === id).length > 0
  if (isSuccess) {
    return h.response(responseObj({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
        bookName: name,
        bookAuthor: author,
        bookSummary: summary,
        bookPublisher: publisher,
        bookPageCount: pageCount || 0,
        bookReadPage: readPage || 0,
        bookReading: reading || false
      }
    })).code(201)
  } else {
    return h.response(responseObj({
      status: 'fail',
      message: 'Buku gagal ditambahkan'
    })).code(500)
  }
}

const getAllBooksHandler = (req) => {
  const { reading, finished, name } = req.query
  if (reading === '1') {
    return {
      status: 'success',
      data: {
        books: getFilteredBooksReading(books, Boolean(parseInt(reading)))
      }
    }
  } else if (reading === '0') {
    return {
      status: 'success',
      data: {
        books: getFilteredBooksReading(books, Boolean(parseInt(reading)))
      }
    }
  }
  if (finished === '1') {
    return {
      status: 'success',
      data: {
        books: getFilteredBooksFinished(books, Boolean(parseInt(finished)))
      }
    }
  } else if (finished === '0') {
    return {
      status: 'success',
      data: {
        books: getFilteredBooksFinished(books, Boolean(parseInt(finished)))
      }
    }
  }
  if (name === 'Dicoding') {
    return {
      status: 'success',
      data: {
        books: getFilteredBooksNamed(books, name)
      }
    }
  } else {
    return {
      status: 'success',
      data: {
        books: getUnfilteredBooks(books)
      }
    }
  }
}

const getDetailBookByIdHandler = (req, h) => {
  const { bookId } = req.params
  const book = books.filter((n) => n.id === bookId)[0]
  if (book !== undefined) {
    return {
      status: 'success',
      data: { book }
    }
  } else {
    return h.response(responseObj({
      status: 'fail',
      message: 'Buku tidak ditemukan'
    })).code(404)
  }
}

const editBookByIdHandler = (req, h) => {
  const { bookId } = req.params
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = req.payload
  const updatedAt = new Date().toISOString()
  const index = books.findIndex((book) => book.id === bookId)
  if (name === '' || name === undefined) {
    return h.response(responseObj({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })).code(400)
  } else if (readPage > pageCount) {
    return h.response(responseObj({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })).code(400)
  } else if (~index) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    }
    return h.response(responseObj({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })).code(200)
  } else {
    return h.response(responseObj({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })).code(404)
  }
}

const deleteBookByIdHandler = (req, h) => {
  const { bookId } = req.params
  const index = books.findIndex((book) => book.id === bookId)
  if (~index) {
    books.splice(index, 1)
    return h.response(responseObj({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })).code(200)
  } else {
    return h.response(responseObj({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan'
    })).code(404)
  }
}

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getDetailBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
}
