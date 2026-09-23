const express = require("express");

const bookControllerModule = require("../../controllers/bookController");

const bookController =
  bookControllerModule.default || bookControllerModule;
  
const authMiddleware = require("../../middleware/authMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");
const upload = require("../../middleware/uploadMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

// Get all books
router.get("/", bookController.getBooks);

// Create book
router.post("/", upload.single("image"), bookController.createBook);

// Update book
router.patch("/:id", upload.single("image"), bookController.updateBook);

// Delete book
router.delete("/:id", bookController.deleteBook);

module.exports = router;