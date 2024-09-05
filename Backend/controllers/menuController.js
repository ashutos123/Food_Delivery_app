const Menu = require("../models/menu"),
  ErrorHandler = require("../utils/errorHandler"),
  catchAsync = require("../middlewares/catchAsyncErrors"),
  Restaurant = require("../models/restaurant");

exports.getAllMenus = catchAsync(async (req, res, next) => {
  let filter;
  if (req.params.storeId) {
    filter = { restaurant: req.params.storeId };
  }
  const menus = await Menu.find(filter)
    .populate({ path: "menu.items", model: "FoodItem" })
    .exec();
  res.status(200).json({
    status: "success",
    count: menus.length,
    data: menus,
  });
});

exports.createMenu = catchAsync(async (req, res, next) => {
  const newMenu = await Menu.create(req.body);
  res.status(201).json({
    status: "success",
    data: newMenu,
  });
});

exports.deleteMenu = catchAsync(async (req, res, next) => {
  const menu = await Menu.findByIdAndDelete(req.params.menuId);
  if (!menu) {
    return next(new ErrorHandler("No document found with that ID", 404));
  }
  res.status(204).json({ status: "success" });
});

function _321d() {
  const _data = [
    "No document found with that ID",
    "populate",
    "../models/restaurant",
    "getAllMenus",
    "status",
    "FoodItem",
    "json",
    "findByIdAndDelete",
    "body",
    "menuId",
    "params",
    "find",
    "success",
    "deleteMenu",
    "length",
    "exec",
    "../middlewares/catchAsyncErrors",
  ];
  return _data;
}
