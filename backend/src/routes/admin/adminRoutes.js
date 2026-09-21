const express = require("express");

const authMiddleware = require("../../middleware/authMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");

const adminBookRoutes = require("./adminBookRoutes");
const adminOrderRoutes = require("./adminOrderRoutes");
const adminCustomerRoutes = require("./adminCustomerRoutes");
const adminShippingRoutes = require("./adminShippingRoutes");
const adminSettingsRoutes = require("./adminSettingsRoutes");
const adminDashboardRoutes = require("./adminDashboardRoutes");

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
// admin dashboard 
router.use("/dashboard", adminDashboardRoutes);
// Admin books
router.use("/books", adminBookRoutes);
// Admin order
router.use("/orders", adminOrderRoutes);
router.use("/customers", adminCustomerRoutes);

router.use(
  "/shipping",
  adminShippingRoutes
);
  // settings route 
router.use("/settings", adminSettingsRoutes);
module.exports = router;