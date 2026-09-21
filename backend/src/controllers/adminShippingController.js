const prisma = require("../config/db");

// Get all shipping locations
const getAdminShippingLocations = async (
  req,
  res
) => {
  try {
    const locations =
      await prisma.shippingLocation.findMany({
        orderBy: {
          name: "asc",
        },
      });

    res.status(200).json({
      success: true,
      locations,
    });
  } catch (error) {
    console.error(
      "GET ADMIN SHIPPING ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch shipping locations",
    });
  }
};

// Create shipping location
const createShippingLocation = async (
  req,
  res
) => {
  try {
    const { name, fee } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Shipping location name is required",
      });
    }

    const shippingFee = Number(fee);

    if (
      Number.isNaN(shippingFee) ||
      shippingFee < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Shipping fee must be a valid positive number",
      });
    }

    const location =
      await prisma.shippingLocation.create({
        data: {
          name: name.trim(),
          fee: shippingFee,
          active: true,
        },
      });

    res.status(201).json({
      success: true,
      message:
        "Shipping location created successfully",
      location,
    });
  } catch (error) {
    console.error(
      "CREATE SHIPPING ERROR:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to create shipping location",
    });
  }
};

// Update shipping location
const updateShippingLocation = async (
  req,
  res
) => {
  try {
    const locationId = Number(
      req.params.id
    );

    if (!locationId) {
      return res.status(400).json({
        success: false,
        message: "Invalid shipping location ID",
      });
    }

    const existingLocation =
      await prisma.shippingLocation.findUnique({
        where: {
          id: locationId,
        },
      });

    if (!existingLocation) {
      return res.status(404).json({
        success: false,
        message:
          "Shipping location not found",
      });
    }

    const { name, fee } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Shipping location name is required",
      });
    }

    const shippingFee = Number(fee);

    if (
      Number.isNaN(shippingFee) ||
      shippingFee < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Shipping fee must be a valid positive number",
      });
    }

    const location =
      await prisma.shippingLocation.update({
        where: {
          id: locationId,
        },

        data: {
          name: name.trim(),
          fee: shippingFee,
        },
      });

    res.status(200).json({
      success: true,
      message:
        "Shipping location updated successfully",
      location,
    });
  } catch (error) {
    console.error(
      "UPDATE SHIPPING ERROR:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to update shipping location",
    });
  }
};

// Toggle active status
const toggleShippingLocation = async (
  req,
  res
) => {
  try {
    const locationId = Number(
      req.params.id
    );

    if (!locationId) {
      return res.status(400).json({
        success: false,
        message: "Invalid shipping location ID",
      });
    }

    const existingLocation =
      await prisma.shippingLocation.findUnique({
        where: {
          id: locationId,
        },
      });

    if (!existingLocation) {
      return res.status(404).json({
        success: false,
        message:
          "Shipping location not found",
      });
    }

    const location =
      await prisma.shippingLocation.update({
        where: {
          id: locationId,
        },

        data: {
          active: !existingLocation.active,
        },
      });

    res.status(200).json({
      success: true,
      message: location.active
        ? "Shipping location activated"
        : "Shipping location deactivated",
      location,
    });
  } catch (error) {
    console.error(
      "TOGGLE SHIPPING ERROR:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to update shipping location",
    });
  }
};

// Delete shipping location
const deleteShippingLocation = async (
  req,
  res
) => {
  try {
    const locationId = Number(
      req.params.id
    );

    if (!locationId) {
      return res.status(400).json({
        success: false,
        message: "Invalid shipping location ID",
      });
    }

    const existingLocation =
      await prisma.shippingLocation.findUnique({
        where: {
          id: locationId,
        },
      });

    if (!existingLocation) {
      return res.status(404).json({
        success: false,
        message:
          "Shipping location not found",
      });
    }

    await prisma.shippingLocation.delete({
      where: {
        id: locationId,
      },
    });

    res.status(200).json({
      success: true,
      message:
        "Shipping location deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE SHIPPING ERROR:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to delete shipping location",
    });
  }
};

module.exports = {
  getAdminShippingLocations,
  createShippingLocation,
  updateShippingLocation,
  toggleShippingLocation,
  deleteShippingLocation,
};