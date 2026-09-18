const orderService = require("../services/orderService");

const createOrder = async (req, res) => {
  try {
    const userId = Number(req.user.id);

    const {
      shippingName,
      shippingPhone,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingCountry,
      shippingLocationId,
    } = req.body;

    // Validate required shipping information
    if (
      !shippingName ||
      !shippingPhone ||
      !shippingAddress ||
      !shippingCity ||
      !shippingState ||
      !shippingCountry ||
      !shippingLocationId
    ) {
      return res.status(400).json({
        success: false,
        message: "All shipping information is required",
      });
    }

    const order = await orderService.createOrder(userId, {
      shippingName,
      shippingPhone,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingCountry,
      shippingLocationId: Number(shippingLocationId),
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    res.status(400).json({
      success: false,
      message: error.message || "Failed to create order",
    });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = Number(req.user.id);

    const orders = await orderService.getUserOrders(userId);

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("GET USER ORDERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const orderId = Number(req.params.id);

    const order = await orderService.getOrderById(userId, orderId);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("GET ORDER ERROR:", error);

    res.status(404).json({
      success: false,
      message: error.message || "Order not found",
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
};