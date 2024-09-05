const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const cartController = require("../controllers/cartController");

// Define routes and their corresponding controller methods
router.post("/add-to-cart", cartController.addItemToCart);
router.post("/update-cart-item", cartController.updateCartItemQuantity);
router.delete("/delete-cart-item", cartController.deleteCartItem);
router.get("/get-cart", authController.protect, cartController.getCartItem);

// Export the router
module.exports = router;
