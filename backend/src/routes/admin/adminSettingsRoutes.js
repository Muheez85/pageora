const express = require("express");

const {
  getAdminSettings,
  updateAdminSettings,
} = require("../../controllers/adminSettingsController");

const router = express.Router();

router.get("/", getAdminSettings);

router.put("/", updateAdminSettings);

module.exports = router;