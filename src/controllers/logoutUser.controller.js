import { User } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

export const logoutUser = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new ApiError(400, "No refresh token found");
  }

  // Find user with this refresh token
  const user = await User.findOne({ refreshToken });
  if (user) {
    user.refreshToken = null; // Remove refresh token from DB
    await user.save();
  }

  // Clear the cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  const response = new ApiResponse(200, null, "Logged out successfully");
  res.status(response.statusCode).json(response);
});
