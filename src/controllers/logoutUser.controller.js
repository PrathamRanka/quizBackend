import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const logoutUser = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new ApiError(400, "No refresh token found");
  }

  await User.findOneAndUpdate(
    { refreshToken },
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  // --- THIS IS THE FIX ---
  const cookieOptions = {
    httpOnly: true,
    secure: true, 
    sameSite: "None", 
  };
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  return res.status(200).json(new ApiResponse(200, {}, "Logged out successfully"));
});