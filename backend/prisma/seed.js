const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const shippingLocations = [
  {
    name: "Lagos",
    fee: 1500,
  },
  {
    name: "Ogun",
    fee: 1000,
  },
  {
    name: "Oyo",
    fee: 1500,
  },
  {
    name: "Abuja",
    fee: 2500,
  },
];

const seed = async () => {
  try {
    for (const location of shippingLocations) {
      await prisma.shippingLocation.upsert({
        where: {
          name: location.name,
        },
        update: {
          fee: location.fee,
          active: true,
        },
        create: {
          name: location.name,
          fee: location.fee,
          active: true,
        },
      });
    }

    console.log("Shipping locations seeded successfully.");
  } catch (error) {
    console.error("SEED ERROR:", error);
  } finally {
    await prisma.$disconnect();
  }
};

seed();