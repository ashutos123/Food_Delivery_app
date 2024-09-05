const express = require("express");
const router = express.Router({ mergeParams: true });

// Import controller functions
const {
  getAllRestaurants,
  createRestaurant,
  getRestaurant,
  deleteRestaurant,
} = require("../controllers/restaurantController");

// Import menu routes
const menuRoutes = require("./menu");

// Define routes
router.route("/")
  .get(getAllRestaurants)
  .post(createRestaurant);

router.route("/:storeId")
  .get(getRestaurant)
  .delete(deleteRestaurant);

router.use("/:storeId/menus", menuRoutes);

module.exports = router;
