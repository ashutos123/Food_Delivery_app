// Required Modules
const User = require("../models/user");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const dotenv = require("dotenv");
const ErrorHandler = require("../utils/errorHandler");
const Email = require("../utils/email");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Load environment variables
dotenv.config({ path: "../config/config.env" });

// Utility function to sign JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME + "d",
  });
};

// Function to create and send token
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        process.env.JWT_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    success: true,
    token,
    data: { user },
  });
};

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage configuration for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "avatars",
    transformation: [{ width: 150, crop: "scale" }],
  },
});
const upload = multer({ storage: storage }).single("avatar");

// Controller: Signup
exports.signup = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, passwordConfirm, phoneNumber } = req.body;

  let avatarData = {};
  if (req.body.avatar === "/images/images.png") {
    avatarData = {
      public_id: "default_avatar",
      url: req.body.avatar,
    };
  } else {
    const uploadResult = await cloudinary.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });
    avatarData = {
      public_id: uploadResult.public_id,
      url: uploadResult.secure_url,
    };
  }

  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    phoneNumber,
    avatar: avatarData,
  });

  createSendToken(user, 201, res);
});

// Controller: Login
exports.login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  createSendToken(user, 200, res);
});

// Controller: Protect route
exports.protect = catchAsyncErrors(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new ErrorHandler("You are not logged in! Please log in to get access.", 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new ErrorHandler("User no longer exists.", 401));
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new ErrorHandler("User recently changed password! Please log in again.", 401));
  }

  req.user = currentUser;
  next();
});

// Controller: Get user profile
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, user });
});

// Controller: Update password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { oldPassword, newPassword, newPasswordConfirm } = req.body;

  const user = await User.findById(req.user.id).select("+password");
  if (!(await user.correctPassword(oldPassword, user.password))) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});
