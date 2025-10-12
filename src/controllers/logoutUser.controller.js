import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const logoutUser = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new ApiError(400, "No refresh token found");
  }

  
  const user = await User.findOne({ refreshToken });
  if (user) {
    user.refreshToken = null; // Remove refresh token from DB
    await user.save();
  }

  
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  const response = new ApiResponse(200, null, "Logged out successfully");
  res.status(response.statusCode).json(response);
});
