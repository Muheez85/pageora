const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const {
  createCategory,
  getCategories,
  updateCategory,
} = require("../controllers/categoryController");

const router = express.Router();

router.get("/", getCategories);

router.post("/", createCategory);

router.patch("/:id", upload.single("image"), updateCategory);

module.exports = router;