import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"; 
import bcrypt from "bcrypt";
import { Session } from "./attempted.model.js"

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    rollNumber: {
      type: String,
      required: [true, "Roll number is required"],
    },
    role: {
      type: String,
      enum: ["user", "admin"], 
      default: "user",
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
    },
    refreshToken: {
      type: String, 
    },
  },
  { timestamps: true }
);

userSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  try {
    console.log(`User ${this._id} is being deleted. Deleting associated sessions...`);
    await Session.deleteMany({ userId: this._id });
    console.log(`Successfully deleted sessions for user ${this._id}.`);
    next();
  } catch (error) {
    console.error(`Error during cascading delete for user ${this._id}:`, error);
    next(error);
  }
});

//  Hash password before saving
        userSchema.pre("save", async function (next) {
        if (!this.isModified("password")) return next();
        this.password = await bcrypt.hash(this.password, 10);
        next();
        });

//  Check password correctness
    userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
    };

//  Generate Access Token
        userSchema.methods.generateAccessToken = function () {
        return jwt.sign(
            {
            _id: this._id,
            email: this.email,
            fullName: this.fullName,
            role: this.role,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        );
        };

//  Generate Refresh Token
        userSchema.methods.generateRefreshToken = function () {
        return jwt.sign(
            { _id: this._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
        );
        };

export const User = mongoose.model("User", userSchema);
