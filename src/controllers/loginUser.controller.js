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
    const { usernameOrEmail, email, password } = req.body;
    const identifier = usernameOrEmail || email;

    console.log("Login request body:", req.body);
    console.log("Identifier:", identifier);

    if (!identifier || !password) {
      throw new ApiError(400, "Email/username and password are required");
    }

    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    // console.log("User found:", user ? "✅ Yes" : "❌ No");

    if (!user) {
      throw new ApiError(401, "Invalid credentials (user not found)");
    }

    const isMatch = await user.isPasswordCorrect(password);
    // console.log("Password match:", isMatch ? "✅ Yes" : "❌ No");

    if (!isMatch) {
      throw new ApiError(401, "Invalid credentials (wrong password)");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    // console.log("Tokens generated ✅");

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json(
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
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};
export { loginUser };

