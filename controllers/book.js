const Book = require("../models/Book");
const Author = require("../models/Author");

/**
 * @swagger
 * tags:
 *   - name: "Books"
 *     description: "Operations related to books"
 */

/**
 * @swagger
 * /books:
 *   get:
 *     tags: ["Books"]
 *     summary: Get all books
 *     description: Retrieves a list of all books, with author details included.
 *     responses:
 *       200:
 *         description: A list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   isbn:
 *                     type: string
 *                   price:
 *                     type: number
 *                   quantity:
 *                     type: number
 *                   author:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to retrieve books"
 */
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate("author", "name");
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve books", details: error.message });
  }
};

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     tags: ["Books"]
 *     summary: Get a single book by ID
 *     description: Retrieves a book by its ID along with author details.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the book
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The book details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 isbn:
 *                   type: string
 *                 price:
 *                   type: number
 *                 quantity:
 *                   type: number
 *                 author:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("author", "name");
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve book", details: error.message });
  }
};

/**
 * @swagger
 * /books:
 *   post:
 *     tags: ["Books"]
 *     summary: Create a new book
 *     description: Adds a new book to the bookstore.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               isbn:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: number
 *               author:
 *                 type: string
 *     responses:
 *       201:
 *         description: The book was created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 isbn:
 *                   type: string
 *                 price:
 *                   type: number
 *                 quantity:
 *                   type: number
 *                 author:
 *                   type: string
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
exports.createBook = async (req, res) => {
  const { title, isbn, price, quantity, author } = req.body;
  if (!title || !isbn || !price || !quantity || !author) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const book = new Book(req.body);
    await book.save();
    await Author.findByIdAndUpdate(author, { $push: { books: book._id } });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: "Failed to create book", details: error.message });
  }
};

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     tags: ["Books"]
 *     summary: Update a book
 *     description: Updates the details of a book.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the book to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               isbn:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: number
 *               author:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated book
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 isbn:
 *                   type: string
 *                 price:
 *                   type: number
 *                 quantity:
 *                   type: number
 *                 author:
 *                   type: string
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
exports.updateBook = async (req, res) => {
  const { author } = req.body;

  try {
    const existingBook = await Book.findById(req.params.id);
    if (!existingBook) return res.status(404).json({ error: "Book not found" });

    if (author && existingBook.author.toString() !== author) {
      await Author.findByIdAndUpdate(existingBook.author, { $pull: { books: existingBook._id } });
      await Author.findByIdAndUpdate(author, { $push: { books: existingBook._id } });
    }

    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: "Failed to update book", details: error.message });
  }
};

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     tags: ["Books"]
 *     summary: Delete a book
 *     description: Deletes a book by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the book to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The book was deleted
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    await Author.findByIdAndUpdate(book.author, { $pull: { books: book._id } });

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete book", details: error.message });
  }
};
