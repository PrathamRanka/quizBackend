import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";


const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found while generating tokens");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // save refresh token to DB for session tracking
    user.refreshToken = refreshToken;


    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error)
   {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens"
    );
  }
};

export { generateAccessAndRefreshToken };
