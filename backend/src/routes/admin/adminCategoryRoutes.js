const express = require("express");

const authMiddleware = require("../../middleware/authMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");

const {
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../../controllers/categoryController");

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;