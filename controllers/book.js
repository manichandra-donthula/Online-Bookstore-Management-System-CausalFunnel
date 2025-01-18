const Book = require("../models/Book");
const Author = require("../models/Author");

// Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate("author", "name");
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve books", details: error.message });
  }
};

// Get a single book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("author", "name");
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve book", details: error.message });
  }
};

// Create a new book
exports.createBook = async (req, res) => {
  const { title, isbn, price, quantity, author } = req.body;
  if (!title || !isbn || !price || !quantity || !author) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Create the book
    const book = new Book(req.body);
    await book.save();

    // Add the book to the author's list
    await Author.findByIdAndUpdate(author, { $push: { books: book._id } });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: "Failed to create book", details: error.message });
  }
};

// Update a book
exports.updateBook = async (req, res) => {
  const { author } = req.body;

  try {
    // Find the book before updating to check for changes in the author
    const existingBook = await Book.findById(req.params.id);
    if (!existingBook) return res.status(404).json({ error: "Book not found" });

    // If the author has changed, update the references in both authors
    if (author && existingBook.author.toString() !== author) {
      // Remove the book from the previous author
      await Author.findByIdAndUpdate(existingBook.author, { $pull: { books: existingBook._id } });

      // Add the book to the new author
      await Author.findByIdAndUpdate(author, { $push: { books: existingBook._id } });
    }

    // Update the book
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: "Failed to update book", details: error.message });
  }
};

// Delete a book
exports.deleteBook = async (req, res) => {
  try {
    // Find and delete the book
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    // Remove the book from the author's list
    await Author.findByIdAndUpdate(book.author, { $pull: { books: book._id } });

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete book", details: error.message });
  }
};
