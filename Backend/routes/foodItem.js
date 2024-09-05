const express = require("express");
const {
  getFoodItem,
  createFoodItem,
  getAllFoodItems,
  deleteFoodItem,
  updateFoodItem,
} = require("../controllers/foodItemController");

const router = express.Router({ mergeParams: true });

// Route to create a new food item
router.route("/item").post(createFoodItem);

// Route to get all food items
router.route("/items/:storeId").get(getAllFoodItems);

// Routes to get, update, and delete a specific food item by ID
router
  .route("/item/:foodId")
  .get(getFoodItem)
  .patch(updateFoodItem)
  .delete(deleteFoodItem);

module.exports = router;
