const wishlistService = require("../services/wishlistService");

const getWishlist = async (req, res) => {
  try {
    const userId = Number(req.user.id);

    const wishlist = await wishlistService.getWishlist(userId);

    res.status(200).json({
      success: true,
      wishlist,
    });
  } catch (error) {
    console.error("GET WISHLIST ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist",
    });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const bookId = Number(req.params.bookId);

    if (!bookId) {
      return res.status(400).json({
        success: false,
        message: "Book ID is required",
      });
    }

    const wishlistItem = await wishlistService.addToWishlist(
      userId,
      bookId
    );

    res.status(201).json({
      success: true,
      message: "Book added to wishlist",
      wishlistItem,
    });
  } catch (error) {
    console.error("ADD TO WISHLIST ERROR:", error);

    res.status(400).json({
      success: false,
      message: error.message || "Failed to add book to wishlist",
    });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const bookId = Number(req.params.bookId);

    if (!bookId) {
      return res.status(400).json({
        success: false,
        message: "Book ID is required",
      });
    }

    await wishlistService.removeFromWishlist(userId, bookId);

    res.status(200).json({
      success: true,
      message: "Book removed from wishlist",
    });
  } catch (error) {
    console.error("REMOVE FROM WISHLIST ERROR:", error);

    res.status(400).json({
      success: false,
      message:
        error.message || "Failed to remove book from wishlist",
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};