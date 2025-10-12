// set by verifyJWT middleware
// frontend sends quizId of selected quiz
// 1. Validate quizId
// 2. Check if the quiz exists
 // 3. Check if a session already exists for this user and quiz
  // 4. Create a new session if it doesn't exist
   // 5. Mark that the user has viewed instructions
     // 6. Send success response
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Session } from "../models/attempted.model.js";
import { Quiz } from "../models/quiz.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";


 const showInstructions = asyncHandler(async (req, res) => {
  const userId = req.user._id; // set by verifyJWT middleware
  const { quizId } = req.body; // frontend sends quizId of selected quiz

  // 1. Validate quizId
  if (!quizId) {
    throw new ApiError(400, "Quiz ID is required");
  }

  // 2. Check if the quiz exists
  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    throw new ApiError(404, "Quiz not found");
  }

  // 3. Check if a session already exists for this user and quiz
  let session = await Session.findOne({ userId, quizId });

  // 4. Create a new session if it doesn't exist
  if (!session) {
    session = await Session.create({ userId, quizId });
  }

  // 5. Mark that the user has viewed instructions
  session.hasViewedInstructions = true;
  await session.save();

  // 6. Send success response
  return res
    .status(200)
    .json(
      new ApiResponse(200, { sessionId: session._id }, "Instructions viewed successfully")
    );
});


export { showInstructions };