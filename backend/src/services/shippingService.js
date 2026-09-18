const prisma = require("../config/db");

const getActiveShippingLocations = async () => {
  return prisma.shippingLocation.findMany({
    where: {
      active: true,
    },
    orderBy: {
      name: "asc",
    },
  });
};

const getShippingLocationById = async (id) => {
  const location = await prisma.shippingLocation.findFirst({
    where: {
      id,
      active: true,
    },
  });

  if (!location) {
    throw new Error("Shipping location not found");
  }

  return location;
};

module.exports = {
  getActiveShippingLocations,
  getShippingLocationById,
};