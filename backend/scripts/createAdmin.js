const bcrypt = require("bcryptjs");
const prisma = require("../src/config/db");

const createAdmin = async () => {
  const name = "Pageora Admin";
  const email = "admin@pageora.com";
  const password = "ChangeMe123!";

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUser) {
      const admin = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          role: "admin",
          password: hashedPassword,
        },
      });

      console.log(`Admin account updated: ${admin.email}`);
      return;
    }

    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "admin",
      },
    });

    console.log(`Admin account created: ${admin.email}`);
  } catch (error) {
    console.error("CREATE ADMIN ERROR:", error.message);
  } finally {
    await prisma.$disconnect();
  }
};

createAdmin();