const Author = require("../models/Author");

/**
 * @swagger
 * tags:
 *   - name: "Authors"
 *     description: "Operations related to authors"
 */

/**
 * @swagger
 * /authors:
 *   get:
 *     tags: ["Authors"]
 *     summary: Get all authors
 *     description: Retrieves a list of all authors, with their books included.
 *     responses:
 *       200:
 *         description: A list of authors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   books:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         title:
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
 *                   example: "Failed to retrieve authors"
 */
// Get all authors
exports.getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.find().populate("books", "title");
    res.status(200).json(authors);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve authors", details: error.message });
  }
};

/**
 * @swagger
 * /authors/{id}:
 *   get:
 *     tags: ["Authors"]
 *     summary: Get a single author by ID
 *     description: Retrieves the details of a single author, including their books.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Author's unique ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Author details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 books:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *       404:
 *         description: Author not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Author not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to retrieve author"
 */
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

/**
 * @swagger
 * /authors:
 *   post:
 *     tags: ["Authors"]
 *     summary: Create a new author
 *     description: Adds a new author to the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Author's name
 *               books:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of book IDs
 *     responses:
 *       201:
 *         description: Author created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 books:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Author name is required"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to create author"
 */
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

/**
 * @swagger
 * /authors/{id}:
 *   put:
 *     tags: ["Authors"]
 *     summary: Update an existing author
 *     description: Modifies the details of an existing author.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Author's unique ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Author's name
 *               books:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of book IDs
 *     responses:
 *       200:
 *         description: Author updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 books:
 *                   type: array
 *                   items:
 *                     type: string
 *       404:
 *         description: Author not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Author not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to update author"
 */
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

/**
 * @swagger
 * /authors/{id}:
 *   delete:
 *     tags: ["Authors"]
 *     summary: Delete an author
 *     description: Removes an author from the system.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Author's unique ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Author deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Author deleted successfully"
 *       404:
 *         description: Author not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Author not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to delete author"
 */
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
