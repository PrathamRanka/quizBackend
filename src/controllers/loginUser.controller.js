//  logic 
   // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

import { generateAccessAndRefreshToken } from "./generateAccessAndRefreshToken.controller.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      throw new ApiError(400, "Identifier and password are required");
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { rollNumber: identifier }],
    });

    if (!user) {
      throw new ApiError(401, "Invalid credentials (user not found)");
    }

    const isMatch = await user.isPasswordCorrect(password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid credentials (wrong password)");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    // --- THIS IS THE FIX ---
    const cookieOptions = {
      httpOnly: true,
      secure: true, // Required for cross-domain cookies
      sameSite: "None", // Allow the cookie to be sent from your Vercel frontend
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          accessToken,
          user: {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
          },
        },
        "Logged in successfully"
      )
    );
  } catch (error) {
    console.error("Login error:", error);
    // Ensure a proper response is sent even on unexpected errors
    const statusCode = error.statusCode || 500;
    const message = error.message || "Something went wrong during login";
    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

export { loginUser };
