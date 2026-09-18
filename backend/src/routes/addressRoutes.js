const express = require("express");

const {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} = require("../controllers/addressController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAddresses);
router.post("/", createAddress);
router.put("/:id", updateAddress);
router.delete("/:id", deleteAddress);

module.exports = router;