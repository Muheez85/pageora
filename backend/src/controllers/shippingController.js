const shippingService = require("../services/shippingService");

const getShippingLocations = async (req, res) => {
  try {
    const locations =
      await shippingService.getActiveShippingLocations();

    res.status(200).json({
      success: true,
      locations,
    });
  } catch (error) {
    console.error("GET SHIPPING LOCATIONS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch shipping locations",
    });
  }
};

module.exports = {
  getShippingLocations,
};