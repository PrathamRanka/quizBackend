import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

 const signUpUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, rollNumber, role, phoneNumber } = req.body;

  if (!fullName || !email || !password || !rollNumber || !phoneNumber) {
    throw new ApiError(400, "Full name, email, password, roll number, and phone number are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "Email is already registered");
  }

  const user = await User.create({
    fullName,
    email,
    password,
    rollNumber,
    role: role || "user",
  });

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();

  // Set refresh token cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json(
  new ApiResponse(201, {
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
    accessToken,
  }, "User registered successfully")
);
});

export {signUpUser}