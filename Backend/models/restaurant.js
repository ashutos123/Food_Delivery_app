const mongoose = require("mongoose");

// Define the restaurant schema
const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the restaurant name"],
    trim: true,
    maxLength: [100, "Restaurant name cannot exceed 100 characters"],
  },
  isVeg: { type: Boolean, default: false },
  address: { type: String, required: [true, "Please enter the restaurant address"] },
  ratings: { type: Number, default: 0 },
  numOfReviews: { type: Number, default: 0 },
  location: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true },
  },
  reviews: [
    {
      name: { type: String, required: true },
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
    },
  ],
  images: [
    {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

// Create a 2dsphere index for the location field
restaurantSchema.index({ location: "2dsphere" });

// Create a text index for the address field
restaurantSchema.index({ address: "text" });

// Export the Restaurant model
const Restaurant = mongoose.model("Restaurant", restaurantSchema);
module.exports = Restaurant;
