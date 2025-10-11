import express from "express";
import { body, validationResult } from "express-validator";
import asyncHandler from "../utils/asyncHandler.js";
import { registerUser } from "../controllers/registerUser.controller.js";


const router = express.Router();


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

router.post(
  "/signup",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("rollNo").notEmpty().withMessage("Roll number is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  validate, 
  asyncHandler(registerUser)
);
export default router;
