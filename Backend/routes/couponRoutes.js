const express = require("express");
const {
  createCoupon,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  couponValidate,
} = require("../controllers/couponController");

const router = express.Router();

// Define routes and their corresponding controller methods
router
  .route("/")
  .post(createCoupon)  // Create a new coupon
  .get(getCoupon);     // Get all coupons

router
  .route("/:couponId")
  .patch(updateCoupon)  // Update a specific coupon by ID
  .delete(deleteCoupon); // Delete a specific coupon by ID

router.route("/validate").post(couponValidate); // Validate a coupon

// Export the router
module.exports = router;
