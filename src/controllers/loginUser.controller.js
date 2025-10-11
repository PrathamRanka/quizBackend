//  logic 
   // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie


import { generateAccessAndRefreshToken } from "./generateAccessAndRefreshToken.controller";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";


  export const loginUser = await User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
  });

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  //admin access
    if (user.role === "admin") 
    {
  redirectTo = "/admin";
  } 
  else 
    {
  redirectTo = "/login";
  }


  // Check password
  const isMatch = await user.comparePassword(password); // assuming user model has this method
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Generate access and refresh tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  // Send refresh token as httpOnly cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

res.status(200).json(
  new ApiResponse(200, {
    accessToken,
    user: {      
      email: user.email,
      password: user.password 
    },
  }, "Logged in successfully")
);



