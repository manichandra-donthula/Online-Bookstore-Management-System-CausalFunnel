const Author = require("../models/Author");

// Get all authors
exports.getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.find().populate("books", "title");
    res.status(200).json(authors);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve authors", details: error.message });
  }
};

// Get a single author by ID
exports.getAuthorById = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id).populate("books", "title");
    if (!author) return res.status(404).json({ error: "Author not found" });
    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve author", details: error.message });
  }
};

// Create a new author
exports.createAuthor = async (req, res) => {
  const { name, books } = req.body;
  if (!name) return res.status(400).json({ error: "Author name is required" });

  try {
    const author = new Author(req.body);
    await author.save();
    res.status(201).json(author);
  } catch (error) {
    res.status(500).json({ error: "Failed to create author", details: error.message });
  }
};

// Update an author
exports.updateAuthor = async (req, res) => {
  try {
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!author) return res.status(404).json({ error: "Author not found" });
    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ error: "Failed to update author", details: error.message });
  }
};

// Delete an author
exports.deleteAuthor = async (req, res) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);
    if (!author) return res.status(404).json({ error: "Author not found" });
    res.status(200).json({ message: "Author deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete author", details: error.message });
  }
};
