const cartService = require("../services/cartService");

// Get current user's cart
const getCart = async (req, res) => {
  try {
    const userId = Number(req.user.id);

    const cart = await cartService.getCart(userId);

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("GET CART ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
    });
  }
};

// Add book to cart
const addToCart = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const { bookId, quantity } = req.body;

    const item = await cartService.addToCart(
      userId,
      Number(bookId),
      Number(quantity)
    );

    res.status(201).json({
      success: true,
      message: "Book added to cart",
      item,
    });
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const itemId = Number(req.params.itemId);
    const { quantity } = req.body;

    const item = await cartService.updateCartItem(
      userId,
      itemId,
      Number(quantity)
    );

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      item,
    });
  } catch (error) {
    console.error("UPDATE CART ERROR:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove item from cart
const removeCartItem = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const itemId = Number(req.params.itemId);

    await cartService.removeCartItem(userId, itemId);

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    console.error("REMOVE CART ITEM ERROR:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
};