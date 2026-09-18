const express = require("express");

const {
  getShippingLocations,
} = require("../controllers/shippingController");

const router = express.Router();

router.get("/", getShippingLocations);

module.exports = router;