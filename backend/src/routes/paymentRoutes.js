const express = require("express");

const {
  initializePayment,
  verifyPayment,
} = require("../controllers/paymentController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/initialize",
  initializePayment
);

router.post(
  "/verify",
  verifyPayment
);

module.exports = router;