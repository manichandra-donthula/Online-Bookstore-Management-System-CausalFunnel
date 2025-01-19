const express = require("express");
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/book");
const { verifyToken, verifyRole } = require("../middleware/auth.js");

const router = express.Router();

router.get("/", verifyToken, verifyRole(["customer", "admin"]), getAllBooks);
router.get("/:id", verifyToken, verifyRole(["customer", "admin"]), getBookById);
router.post("/", verifyToken, verifyRole("admin"), createBook);
router.put("/:id", verifyToken, verifyRole("admin"), updateBook);
router.delete("/:id", verifyToken, verifyRole("admin"), deleteBook);

module.exports = router;
