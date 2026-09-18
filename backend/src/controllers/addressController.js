const prisma = require("../config/db");

const getAddresses = async (req, res) => {
  try {
    const userId = Number(req.user.id);

    const addresses = await prisma.address.findMany({
      where: {
        userId,
      },
      orderBy: [
        {
          isDefault: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

    res.status(200).json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.error("GET ADDRESSES ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch addresses",
    });
  }
};

const createAddress = async (req, res) => {
  try {
    const userId = Number(req.user.id);

    const {
      label,
      fullName,
      phone,
      address,
      city,
      state,
      country,
      isDefault,
    } = req.body;

    if (
      !label ||
      !fullName ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !country
    ) {
      return res.status(400).json({
        success: false,
        message: "All address information is required",
      });
    }

    const shouldBeDefault = Boolean(isDefault);

    /*
     * If this address is being made the default,
     * remove the default status from existing addresses.
     */
    if (shouldBeDefault) {
      await prisma.address.updateMany({
        where: {
          userId,
        },
        data: {
          isDefault: false,
        },
      });
    }

    /*
     * If the user has no addresses yet,
     * automatically make the first one default.
     */
    const existingAddressCount =
      await prisma.address.count({
        where: {
          userId,
        },
      });

    const addressRecord = await prisma.address.create({
      data: {
        userId,
        label: label.trim(),
        fullName: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        country: country.trim(),
        isDefault:
          existingAddressCount === 0 ||
          shouldBeDefault,
      },
    });

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      address: addressRecord,
    });
  } catch (error) {
    console.error("CREATE ADDRESS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add address",
    });
  }
};

const updateAddress = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const addressId = Number(req.params.id);

    const {
      label,
      fullName,
      phone,
      address,
      city,
      state,
      country,
      isDefault,
    } = req.body;

    if (
      !label ||
      !fullName ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !country
    ) {
      return res.status(400).json({
        success: false,
        message: "All address information is required",
      });
    }

    const existingAddress =
      await prisma.address.findFirst({
        where: {
          id: addressId,
          userId,
        },
      });

    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    const shouldBeDefault = Boolean(isDefault);

    if (shouldBeDefault) {
      await prisma.address.updateMany({
        where: {
          userId,
          id: {
            not: addressId,
          },
        },
        data: {
          isDefault: false,
        },
      });
    }

    const updatedAddress =
      await prisma.address.update({
        where: {
          id: addressId,
        },
        data: {
          label: label.trim(),
          fullName: fullName.trim(),
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
          state: state.trim(),
          country: country.trim(),
          isDefault: shouldBeDefault,
        },
      });

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address: updatedAddress,
    });
  } catch (error) {
    console.error("UPDATE ADDRESS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update address",
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const addressId = Number(req.params.id);

    const existingAddress =
      await prisma.address.findFirst({
        where: {
          id: addressId,
          userId,
        },
      });

    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    await prisma.address.delete({
      where: {
        id: addressId,
      },
    });

    /*
     * If the deleted address was the default,
     * make the newest remaining address default.
     */
    if (existingAddress.isDefault) {
      const nextAddress =
        await prisma.address.findFirst({
          where: {
            userId,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

      if (nextAddress) {
        await prisma.address.update({
          where: {
            id: nextAddress.id,
          },
          data: {
            isDefault: true,
          },
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ADDRESS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete address",
    });
  }
};

module.exports = {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
};