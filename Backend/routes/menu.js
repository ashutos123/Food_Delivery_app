const express = require("express");
const {
  getAllMenus,
  createMenu,
  deleteMenu,
} = require("../controllers/menuController");

const router = express.Router({ mergeParams: true });

// Route to get all menus and create a new menu
router.route("/")
  .get(getAllMenus)
  .post(createMenu);

// Route to delete a specific menu by ID
router.route("/:menuId").delete(deleteMenu);

module.exports = router;
