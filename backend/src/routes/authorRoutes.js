const express = require("express");

const {
  getAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} = require("../controllers/authorController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Public
router.get("/", getAuthors);

// Admin only
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createAuthor
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateAuthor
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteAuthor
);

module.exports = router;