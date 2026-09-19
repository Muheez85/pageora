const prisma = require("../config/db");

const adminMiddleware = async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
    select: {
      role: true,
    },
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User not found",
    });
  }

  if (user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  req.user.role = user.role;

  next();
};

module.exports = adminMiddleware;