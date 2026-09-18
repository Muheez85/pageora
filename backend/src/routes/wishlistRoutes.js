const express = require("express");

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getWishlist);

router.post("/:bookId", addToWishlist);

router.delete("/:bookId", removeFromWishlist);

module.exports = router;