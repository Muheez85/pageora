const express = require("express");

const authMiddleware = require("../../middleware/authMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");

const {
  createAuthor,
  updateAuthor,
  deleteAuthor,
} = require("../../controllers/authorController");

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.post("/", createAuthor);
router.put("/:id", updateAuthor);
router.delete("/:id", deleteAuthor);

module.exports = router;