const express = require("express");
const {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} = require("../controllers/author");
const { verifyToken, verifyRole } = require("../middleware/auth.js");

const router = express.Router();

router.get("/", verifyToken, verifyRole(["customer", "admin"]), getAllAuthors);
router.get("/:id", verifyToken, verifyRole(["customer", "admin"]), getAuthorById);
router.post("/", verifyToken, verifyRole("admin"), createAuthor);
router.put("/:id", verifyToken, verifyRole("admin"), updateAuthor);
router.delete("/:id", verifyToken, verifyRole("admin"), deleteAuthor);

module.exports = router;
