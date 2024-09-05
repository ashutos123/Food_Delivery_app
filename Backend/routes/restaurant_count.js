const express = require("express");
const router = express.Router();
const Restaurant = require("../models/restaurant");

router.get("/count", async (req, res) => {
  try {
    // Get the count of restaurant documents in the database
    const count = await Restaurant.countDocuments();
    res.json({ count });
  } catch (error) {
    // If an error occurs, send a 500 response with an error message
    res.status(500).json({ error: "Unable to fetch the number of restaurants." });
  }
});

module.exports = router;
