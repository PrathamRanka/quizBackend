import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const checkServerStatus = asyncHandler(async (req, res) => {
  const { mode } = req.query;

  if (mode === 'default') {
    return res
      .status(200)
      .json(new ApiResponse(200, { status: "running" }, "Default quiz mode is active."));
  }

  // --- Logic for the SCHEDULED quiz ---

  // 2. Get the configured start time from your .env file
  const quizStartTimeString = process.env.QUIZ_START_TIME;

  
  if (!quizStartTimeString) {
    console.warn("WARNING: QUIZ_START_TIME is not set in the .env file. Defaulting scheduled quiz to 'running'.");
    return res
      .status(200)
      .json(new ApiResponse(200, { status: "running" }, "Server is active (no start time configured for scheduled quiz)."));
  }

  const quizStartTime = new Date(quizStartTimeString);
  const currentTime = new Date();

  if (currentTime >= quizStartTime) {
    return res
      .status(200)
      .json(new ApiResponse(200, { status: "running" }, "The scheduled quiz is now active."));
  } else {
    // If the current time is before the start time, users must wait.
    return res
      .status(200)
      .json(new ApiResponse(200, { status: "waiting", startTime: quizStartTime.toISOString() }, "The scheduled quiz has not started yet."));
  }
});

export { checkServerStatus };

