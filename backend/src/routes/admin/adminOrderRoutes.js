const express = require("express");

const {
  getAdminOrders,
  getAdminOrderById,
  updateOrderStatus,
} = require("../../controllers/adminOrderController");

const router = express.Router();

router.get("/", getAdminOrders);

router.get("/:id", getAdminOrderById);

router.put("/:id/status", updateOrderStatus);

module.exports = router;