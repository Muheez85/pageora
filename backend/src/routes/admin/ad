const express = require("express");

const {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
} = require("../../controllers/bookController");

const authMiddleware = require("../../middleware/authMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");
const upload = require("../../middleware/uploadMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

// Get all books
router.get("/", getBooks);

// Create book
router.post("/", upload.single("image"), createBook);

// Update book
router.patch("/:id", upload.single("image"), updateBook);

// Delete book
router.delete("/:id", deleteBook);

module.exports = router;