import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getQuizQuestions } from "../controllers/getQuiz.controller.js";

const router = express.Router();

// GET /api/quiz/:quizId/questions
router.get(
  "/:quizId/questions",
  verifyJWT,
  asyncHandler(getQuizQuestions)
);

export default router;
