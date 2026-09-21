const express = require("express");

const {
  getAdminShippingLocations,
  createShippingLocation,
  updateShippingLocation,
  toggleShippingLocation,
  deleteShippingLocation,
} = require("../../controllers/adminShippingController");

const router = express.Router();

router.get("/", getAdminShippingLocations);

router.post("/", createShippingLocation);

router.put("/:id", updateShippingLocation);

router.patch(
  "/:id/toggle",
  toggleShippingLocation
);

router.delete(
  "/:id",
  deleteShippingLocation
);

module.exports = router;