const prisma = require("../config/db");

const getAdminSettings = async (req, res) => {
  try {
    let settings = await prisma.storeSettings.findUnique({
      where: {
        id: 1,
      },
    });

    // Create default settings if they don't exist
    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: {
          id: 1,
          storeName: "Pageora",
          country: "Nigeria",
          currency: "NGN",
        },
      });
    }

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("GET ADMIN SETTINGS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch store settings",
    });
  }
};

const updateAdminSettings = async (req, res) => {
  try {
    const {
      storeName,
      email,
      phone,
      address,
      city,
      state,
      country,
      currency,
      description,
    } = req.body;

    if (!storeName || !storeName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Store name is required",
      });
    }

    const settings = await prisma.storeSettings.upsert({
      where: {
        id: 1,
      },

      update: {
        storeName: storeName.trim(),
        email: email?.trim() || "",
        phone: phone?.trim() || "",
        address: address?.trim() || "",
        city: city?.trim() || "",
        state: state?.trim() || "",
        country: country?.trim() || "",
        currency: currency?.trim() || "NGN",
        description: description?.trim() || "",
      },

      create: {
        id: 1,
        storeName: storeName.trim(),
        email: email?.trim() || "",
        phone: phone?.trim() || "",
        address: address?.trim() || "",
        city: city?.trim() || "",
        state: state?.trim() || "",
        country: country?.trim() || "",
        currency: currency?.trim() || "NGN",
        description: description?.trim() || "",
      },
    });

    res.status(200).json({
      success: true,
      message: "Store settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error("UPDATE ADMIN SETTINGS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update store settings",
    });
  }
};

module.exports = {
  getAdminSettings,
  updateAdminSettings,
};