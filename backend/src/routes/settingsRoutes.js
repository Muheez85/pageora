const express = require("express");

const {
  changePassword,
} = require("../controllers/settingsController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.put("/password", changePassword);

module.exports = router;