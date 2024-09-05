const express = require("express");
const router = express.Router();
const { newOrder, getSingleOrder, myOrders } = require("../controllers/orderController");
const authController = require("../controllers/authController");

// Route to create a new order
router.route("/new").post(authController.protect, newOrder);

// Route to get a single order by ID
router.route("/:id").get(authController.protect, getSingleOrder);

// Route to get all orders for the authenticated user
router.route("/me/myOrders").get(authController.protect, myOrders);

module.exports = router;
