import express from "express";
import { body, validationResult } from "express-validator";
import asyncHandler from "../utils/asyncHandler.js";
import { loginUser } from "../controllers/loginUser.controller.js";


const router = express.Router();

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

// POST /api/auth/login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  asyncHandler(loginUser)
);

export default router;
