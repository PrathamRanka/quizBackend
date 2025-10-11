import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { submitQuiz } from "../controllers/submitQuiz.controller.js";

const router = express.Router();

// POST /api/quiz/submit
router.post(
  "/submit",
  verifyJWT,
  asyncHandler(submitQuiz)
);

export default router;
