const getUnfilteredBooks = (books) => books.map((book) => ({
  id: book.id,
  name: book.name,
  publisher: book.publisher
}))

const getFilteredBooksReading = (books, status) => books
  .filter((n) => n.reading === status).map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher
  }))

const getFilteredBooksFinished = (books, status) => books
  .filter((n) => n.finished === status).map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher
  }))

const getFilteredBooksNamed = (books, queryName) => books.filter((n) =>
  n.name.toLowerCase().includes(queryName.toLowerCase())).map((book) => ({
  id: book.id,
  name: book.name,
  publisher: book.publisher
}))

module.exports = {
  getUnfilteredBooks,
  getFilteredBooksReading,
  getFilteredBooksFinished,
  getFilteredBooksNamed
}
