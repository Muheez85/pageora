const express = require("express");

const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} = require("../controllers/cartController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getCart);

router.post("/", authMiddleware, addToCart);

router.patch("/:itemId", authMiddleware, updateCartItem);

router.delete("/:itemId", authMiddleware, removeCartItem);

module.exports = router;