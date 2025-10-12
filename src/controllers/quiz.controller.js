import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Session } from "../models/session.model.js";
import { Questions } from "../models/questions.model.js";

// Controller: startQuiz
const startQuiz = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { quizId } = req.params;

  // 1. Validate input
  if (!quizId) {
    throw new ApiError(400, "Quiz ID is required");
  }

  // 2. Check if session exists
  const session = await Session.findOne({ userId, quizId });
  if (!session) {
    throw new ApiError(400, "Please view instructions first.");
  }

  // 3. Check if user viewed instructions
  if (!session.hasViewedInstructions) {
    throw new ApiError(403, "You must view instructions before starting the quiz.");
  }

  // 4. Fetch all questions for the quiz
  const questions = await Questions.find({ quizId }).sort({ position: 1 }).select('-options.isCorrect'); // Exclude correct answers to dev tools

  if (!questions || questions.length === 0) {
    throw new ApiError(404, "No questions found for this quiz.");
  }

  // 5. Return success response
  return res
    .status(200)
    .json(
      new ApiResponse(200, { sessionId: session._id, questions }, "Quiz started successfully")
    );
});

export { startQuiz};