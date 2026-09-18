const paymentService = require("../services/paymentService");

const initializePayment = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const payment =
      await paymentService.initializePayment(
        userId,
        Number(orderId)
      );

    res.status(200).json({
      success: true,
      message: "Payment initialized successfully",
      payment,
    });
  } catch (error) {
    console.error(
      "INITIALIZE PAYMENT ERROR:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to initialize payment",
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const { reference } = req.body;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Payment reference is required",
      });
    }

    const order =
      await paymentService.verifyPayment(
        userId,
        reference
      );

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order,
    });
  } catch (error) {
    console.error(
      "VERIFY PAYMENT ERROR:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to verify payment",
    });
  }
};

module.exports = {
  initializePayment,
  verifyPayment,
};