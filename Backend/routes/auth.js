const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Define routes and their corresponding controller methods
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.get("/logout", authController.logout);
router.patch("/updatePassword", authController.protect, authController.updatePassword);
router.patch("/me/update", authController.protect, authController.updateProfile);

// Export the router
module.exports = router;
