const express = require("express");

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Get all categories
router.get("/", getCategories);

// Create category
router.post("/", upload.single("image"), createCategory);

// Update category
router.put("/:id", upload.single("image"), updateCategory);

// Delete category
router.delete("/:id", deleteCategory);

module.exports = router;