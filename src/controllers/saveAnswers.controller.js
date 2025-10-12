import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Session } from "../models/attempted.model.js";

// Controller: saveAnswer
 const saveAnswer = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { sessionId } = req.params;
  const { questionId, selectedOption, timeSpentSec } = req.body;

  // 1. Validate required fields
  if (!sessionId || !questionId || selectedOption === undefined || timeSpentSec === undefined) {
    throw new ApiError(400, "Missing required fields");
  }

  // 2. Find the session for this user
  const session = await Session.findOne({ _id: sessionId, userId });
  if (!session) {
    throw new ApiError(404, "Session not found");
  }

  // 3. Check if the answer for this question already exists
  const existingAnswer = session.answers.find(
    (a) => a.questionId.toString() === questionId
  );

  if (existingAnswer) {
    // Update existing answer
    existingAnswer.selectedOption = selectedOption;
    existingAnswer.timeSpentSec = timeSpentSec;
    existingAnswer.answeredAt = new Date();
  } else {
    // Add new answer
    session.answers.push({
      questionId,
      selectedOption,
      timeSpentSec,
      answeredAt: new Date(),
    });
  }

  // 4. Save session
  await session.save();

  // 5. Return success response
  return res
    .status(200)
    .json(new ApiResponse(200, { sessionId: session._id }, "Answer saved successfully"));
});


export { saveAnswer };