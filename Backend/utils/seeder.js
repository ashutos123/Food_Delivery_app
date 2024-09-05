const Fooditem = require("../models/foodItem");
const dotenv = require("dotenv");
const connectDatabase = require("../config/database");
const fooditems = require("../data/foodItem.json");
const { connect } = require("mongoose");

// Load environment variables from config file
dotenv.config({ path: "backend/config/config.env" });

// Connect to the database
connectDatabase();

const seedFooditems = async () => {
  try {
    // Delete all existing food items
    await Fooditem.deleteMany();
    console.log("FoodItems are deleted");

    // Insert new food items from the JSON file
    await Fooditem.insertMany(fooditems);
    console.log("All FoodItems are added.");

    // Exit the process after seeding
    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};

// Execute the seed function
seedFooditems();
