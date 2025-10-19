import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const signUpUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, rollNumber, role, phoneNumber } = req.body;

  // --- 1. Basic & Specific Validation ---
  if ([fullName, email, password, rollNumber, phoneNumber].some((field) => !field || field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // Added specific validation rules
  if (!rollNumber.startsWith('1025') && !rollNumber.startsWith('1024') || rollNumber.length !== 10 || !/^\d+$/.test(rollNumber)) {
    throw new ApiError(400, 'Invalid Roll Number. It must start with "1025" or "1024" and be 10 digits long.');
  }
  if (!email.endsWith('@thapar.edu')) {
    throw new ApiError(400, 'Invalid Email. You must use a "@thapar.edu" email address.');
  }
  if (phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
    throw new ApiError(400, 'Invalid Phone Number. It must be exactly 10 digits.');
  }
  if (password.length < 6) {
    throw new ApiError(400, 'Password must be at least 6 characters long.');
  }

  // --- 2. Check for any existing unique field ---
  const existingUser = await User.findOne({
    $or: [{ email }, { rollNumber }, { phoneNumber }]
  });

  if (existingUser) {
    // Check which field caused the conflict and provide a specific, helpful error message
    if (existingUser.email === email) {
      throw new ApiError(409, "A user with this email address already exists.");
    }
    if (existingUser.rollNumber === rollNumber) {
      throw new ApiError(409, "A user with this roll number already exists.");
    }
    if (existingUser.phoneNumber === phoneNumber) {
      throw new ApiError(409, "A user with this phone number already exists.");
    }
  }

  // --- 3. Create User and Send Response ---
  const user = await User.create({
    fullName,
    email,
    password,
    rollNumber,
    phoneNumber,
    role: role || "user",
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user.");
  }

  // Generate tokens, set cookies, and send the final response
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        { user: createdUser, accessToken },
        "User registered successfully"
      )
    );
});

export { signUpUser };

