const express = require("express");

const authMiddleware = require("../../middleware/authMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");

const adminBookRoutes = require("./adminBookRoutes");

const router = express.Router();

// Protect all admin routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Admin test
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Admin access confirmed",
  });
});

// Admin books
router.use("/books", adminBookRoutes);

module.exports = router;