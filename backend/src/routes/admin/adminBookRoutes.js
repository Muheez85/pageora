
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

router.get("/", getBooks);

router.post("/", upload.single("image"), createBook);

router.put("/:id", upload.single("image"), updateBook);

router.delete("/:id", deleteBook);

module.exports = router;