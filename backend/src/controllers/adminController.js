const bcrypt = require("bcryptjs");

const prisma = require("../config/db");
const generateToken = require("../utils/generateToken");

// Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};

// Admin Test
const getAdminTest = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin access confirmed",
    user: {
      id: req.user.id,
      role: req.user.role,
    },
  });
};

module.exports = {
  adminLogin,
  getAdminTest,
};