const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { processPayment, sendStripApi } = require("../controllers/paymentController");

// Route to process a payment
router.route("/payment/process").post(
  authController.protect,
  processPayment
);

// Route to handle Stripe API requests
router.route("/stripeapi").get(
  authController.protect,
  sendStripApi
);

module.exports = router;
