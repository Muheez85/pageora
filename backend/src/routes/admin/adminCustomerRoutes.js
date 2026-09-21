const express = require("express");

const {
  getAdminCustomers,
  getAdminCustomerById,
} = require("../../controllers/adminCustomerController");

const router = express.Router();

router.get("/", getAdminCustomers);

router.get("/:id", getAdminCustomerById);

module.exports = router; 