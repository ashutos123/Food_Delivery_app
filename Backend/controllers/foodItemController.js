const Fooditem = require("../models/foodItem"),
  ErrorHandler = require("../utils/errorHandler"),
  catchAsync = require("../middlewares/catchAsyncErrors"),
  APIFeatures = require("../utils/apiFeatures");

exports.createFoodItem = catchAsync(async (req, res, next) => {
  const newFoodItem = await Fooditem.create(req.body);
  res.status(201).json({
    status: "success",
    data: newFoodItem,
  });
});

exports.getAllFoodItems = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.storeId) filter = { restaurant: req.params.storeId };
  const foodItems = await Fooditem.find(filter);
  const features = new APIFeatures(Fooditem.find(), req.query)
    .search()
    .filter();
  res.status(200).json({
    status: "success",
    results: foodItems.length,
    data: foodItems,
  });
});

exports.getFoodItem = catchAsync(async (req, res, next) => {
  const foodItem = await Fooditem.findById(req.params.foodId);
  if (!foodItem) {
    return next(new ErrorHandler("No foodItem found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: foodItem,
  });
});

exports.updateFoodItem = catchAsync(async (req, res, next) => {
  const updatedFoodItem = await Fooditem.findByIdAndUpdate(
    req.params.foodId,
    req.body,
    { new: true, runValidators: true }
  );
  if (!updatedFoodItem) {
    return next(new ErrorHandler("No document found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: updatedFoodItem,
  });
});

exports.deleteFoodItem = catchAsync(async (req, res, next) => {
  const foodItem = await Fooditem.findByIdAndDelete(req.params.foodId);
  if (!foodItem) {
    return next(new ErrorHandler("No document found with that ID", 404));
  }
  res.status(204).json({ status: "success" });
});
