const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const errorMiddleware = require("./middlewares/errors");

// Configure environment variables and connect to Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());

// Proxy middleware
app.use("/proxy", (req, res) => {
  const requestUrl = "http://localhost:3000" + req.originalUrl;
  req.pipe(request(requestUrl)).pipe(res);
});

// Route imports
const foodRouter = require("./routes/foodItem");
const restaurantRouter = require("./routes/restaurant");
const menuRouter = require("./routes/menu");
const couponRouter = require("./routes/couponRoutes");
const orderRouter = require("./routes/order");
const authRouter = require("./routes/auth");
const paymentRouter = require("./routes/payment");
const cartRouter = require("./routes/cart");

// Route setup
app.use(express.json({ limit: '30kb' }));
app.use(express.urlencoded({ extended: true, limit: '30kb' }));
app.use("/api/v1/eats/menus", menuRouter);
app.use("/api/v1/eats", foodRouter);
app.use("/api/v1/eats/restaurants", restaurantRouter);
app.use("/api/v1/eats/orders", orderRouter);
app.use("/api/v1/eats/auth", authRouter);
app.use("/api/v1", paymentRouter);
app.use("/api/v1/coupon", couponRouter);
app.use("/api/v1/carts", cartRouter);

// View engine setup
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// 404 handler
app.all("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Error middleware
app.use(errorMiddleware);

module.exports = app;
