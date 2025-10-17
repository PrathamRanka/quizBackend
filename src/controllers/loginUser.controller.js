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
    // The field from the frontend could be 'email' or 'rollNumber'
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      throw new ApiError(400, "Identifier (email or roll number) and password are required");
    }

    // Find the user by either email or rollNumber
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

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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
